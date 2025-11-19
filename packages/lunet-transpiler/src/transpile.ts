import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

const jsxAttr2Object = (
    ast: (t.JSXAttribute | t.JSXSpreadAttribute)[],
): t.ObjectExpression => t.objectExpression(ast.map(e=>
    e.type === "JSXAttribute"
        ? t.objectProperty(
            t.identifier(
                e.name.type === "JSXIdentifier"
                    ? e.name.name
                    : e.name.name.name),
            e.value
                ? e.value.type === "StringLiteral"
                    ? e.value
                    : jsx2Expression(e.value, true)
                : t.booleanLiteral(true))
        : t.spreadElement(e.argument)
));

const jsxMemberToMemberExpression = (ast: t.JSXMemberExpression | t.JSXIdentifier): t.MemberExpression | t.Identifier =>
    ast.type === "JSXIdentifier"
        ? t.identifier(ast.name)
        : t.memberExpression(jsxMemberToMemberExpression(ast.object), jsxMemberToMemberExpression(ast.property));

const filterEmptyString = (ast: t.Expression | t.SpreadElement) => !(ast.type === "StringLiteral" && !ast.value);

const jsx2Elements = (
    ast: ReturnType<typeof t.jsxFragment>["children"] extends (infer P)[] ? P : never,
    dontTrim?: boolean
): t.Expression | t.SpreadElement => {
    if(ast.type === "JSXSpreadChild")
        return t.spreadElement(ast.expression);
    else
        return jsx2Expression(ast, dontTrim);
}

const jsx2Expression = (
    ast: ReturnType<typeof t.jsxFragment>["children"] extends (infer P)[] ? P : never,
    dontTrim?: boolean
): t.Expression => {
    switch(ast.type){
        case "JSXText": return t.stringLiteral(dontTrim ? ast.value : ast.value.trim());
        case "JSXFragment": return t.arrayExpression([
                t.nullLiteral(),
                t.objectExpression([]),
                t.arrayExpression(ast.children.map(child=>jsx2Elements(child)).filter(filterEmptyString))
            ]);
        case "JSXElement":
            const tag = ast.openingElement.name;
            if(tag.type === "JSXIdentifier" && /^[a-z]/.test(tag.name)){
                return t.arrayExpression([
                    t.stringLiteral(tag.name),
                    t.objectExpression(ast.openingElement.attributes.map(attr => {
                        if (attr.type === "JSXAttribute") {
                            if (attr.name.type === "JSXNamespacedName")
                                console.warn("Warning: JSXNamespacedName is not supported");
                            const { name } = attr.name;
                            return t.objectProperty(
                                t.identifier(typeof name === "string" ? name : name.name),
                                attr.value
                                    ? attr.value.type === "StringLiteral"
                                        ? attr.value
                                        : jsx2Expression(attr.value)
                                    : t.booleanLiteral(true)
                            );
                        } else {
                            return t.spreadElement(attr.argument);
                        }
                    })),
                    t.arrayExpression(ast.children.map(child => jsx2Elements(child)).filter(filterEmptyString))
                ])
            }else switch(tag.type){
                case "JSXIdentifier":
                    return t.callExpression(t.identifier(tag.name), [
                        jsxAttr2Object(ast.openingElement.attributes)
                    ]);
                case "JSXMemberExpression":
                    return t.callExpression(jsxMemberToMemberExpression(tag), [
                        jsxAttr2Object(ast.openingElement.attributes)
                    ]);
                case "JSXNamespacedName":
                    console.warn("Warning: JSXNamespacedName is not supported");
                    return t.callExpression(t.identifier(tag.name.name), [
                        jsxAttr2Object(ast.openingElement.attributes)
                    ]);
            }
        case "JSXExpressionContainer": switch(ast.expression.type){
                case "JSXEmptyExpression":
                    return t.booleanLiteral(true);
                case "JSXElement": case "JSXFragment":
                    return jsx2Expression(ast.expression);
                default:
                    return ast.expression;
            }
        case "JSXSpreadChild": return t.arrayExpression([
            t.nullLiteral(),
            t.objectExpression([]),
            ast.expression
        ]);
    }
}

export const transpile = (code: string, isTypeScript: boolean): string => {
    const ast = parse(code, {
        sourceType: "module",
        plugins: isTypeScript ? ["typescript", "jsx"] : ["jsx"]
    });

    traverse(ast, {
        JSXElement(ast){
            ast.replaceWith(jsx2Expression(ast.node));
        },
        JSXFragment(ast){
            ast.replaceWith(jsx2Expression(ast.node));
        }
    });
    
    return generate(ast).code;
}
