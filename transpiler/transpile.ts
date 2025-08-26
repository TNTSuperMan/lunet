import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

const generateUniqueName = (base: string, used: Set<string>): string => {
    let name = base;
    let counter = 1;
    while(used.has(name))
        name = `${base}$${counter++}`;
    return name;
}

const jsxAttr2Object = (
    ast: (t.JSXAttribute | t.JSXSpreadAttribute)[],
    jsx: string,
    frag: string
): t.ObjectExpression => t.objectExpression(ast.map(e=>
    e.type === "JSXAttribute" ?
        t.objectProperty(
            t.identifier(
                e.name.type === "JSXIdentifier" ?
                    e.name.name :
                    e.name.name.name),
            e.value ?
                e.value.type === "StringLiteral" ?
                    e.value :
                    jsx2Expression(e.value, jsx, frag, true) :
                t.booleanLiteral(true)) :
        t.spreadElement(e.argument)
));

const filterEmptyString = (ast: t.Expression | t.SpreadElement) => !(ast.type === "StringLiteral" && !ast.value);

const jsx2Elements = (
    ast: ReturnType<typeof t.jsxFragment>["children"] extends (infer P)[] ? P : never,
    jsx: string,
    frag: string,
    dontTrim?: boolean
): t.Expression | t.SpreadElement => {
    if(ast.type === "JSXSpreadChild")
        return t.spreadElement(ast.expression);
    else
        return jsx2Expression(ast, jsx, frag, dontTrim);
}

const jsx2Expression = (
    ast: ReturnType<typeof t.jsxFragment>["children"] extends (infer P)[] ? P : never,
    jsx: string,
    frag: string,
    dontTrim?: boolean
): t.Expression => {
    switch(ast.type){
        case "JSXText": return t.stringLiteral(dontTrim ? ast.value : ast.value.trim());
        case "JSXFragment": return t.callExpression(
                t.identifier(frag),
                ast.children.map(child=>jsx2Elements(child, jsx, frag)).filter(filterEmptyString)
            );
        case "JSXElement":
            const tag = ast.openingElement.name;
            if(tag.type === "JSXIdentifier" && /^[a-z]/.test(tag.name)){
                return t.callExpression(
                    t.memberExpression(
                        t.identifier(jsx),
                        t.identifier(tag.name)
                    ), [
                        jsxAttr2Object(ast.openingElement.attributes, jsx, frag),
                        ...ast.children.map(child=>jsx2Elements(child, jsx, frag)).filter(filterEmptyString)
                    ]
                )
            }else switch(tag.type){
                case "JSXIdentifier":
                    return t.callExpression(t.identifier(tag.name), [
                        jsxAttr2Object(ast.openingElement.attributes, jsx, frag)
                    ]);
                default:
                    throw new Error("not implemented");
            }
        case "JSXExpressionContainer": switch(ast.expression.type){
                case "JSXEmptyExpression":
                    return t.booleanLiteral(true);
                case "JSXElement": case "JSXFragment":
                    return jsx2Expression(ast.expression, jsx, frag);
                default:
                    return ast.expression;
            }
        case "JSXSpreadChild": return t.callExpression(
                t.identifier(frag),
                [t.spreadElement(ast.expression)]
            );
    }
}

export const transpile = (code: string, options: Exclude<Parameters<typeof parse>[1], undefined>) => {
    const ast = parse(code, options);

    const identifiers = new Set<string>();
    traverse(ast, {
        Identifier(ast){
            identifiers.add(ast.node.name);
        }
    });

    const jsx_identifier = generateUniqueName("jsx", identifiers);
    const fragment_identifier = generateUniqueName("fragment", identifiers);

    traverse(ast, {
        JSXElement(ast){
            ast.replaceWith(jsx2Expression(ast.node, jsx_identifier, fragment_identifier));
        },
        JSXFragment(ast){
            ast.replaceWith(jsx2Expression(ast.node, jsx_identifier, fragment_identifier));
        }
    });
    return generate(ast).code;
}
