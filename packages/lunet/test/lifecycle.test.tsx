import { test, expect, mock } from "bun:test";
import { drainMicrotasks } from "bun:jsc";
import { withRender } from "./utils/withRender";
import { h, fragment } from "../src";
import { pureNode, pureNodes } from "./utils/pure_node";
import type { JSXNode } from "../src";

test("Test lifecycle events", () => {
    const r = withRender();
    const render = (jsx: JSXNode) => { r(jsx); drainMicrotasks(); }

    const history: number[] = [];
    const elements: HTMLElement[] = [];

    const beforeMount = mock(() => {
        history.push(0);
    });
    const mount = mock(function (this: HTMLElement, ev: CustomEvent<HTMLElement>) {
        expect(ev).toBeInstanceOf(CustomEvent);
        expect(ev.type).toBe("mount");
        expect(this).toBe(ev.detail);
        // メモ: 要素の$mount時点では親要素に追加されていない、多分今後のTODO
        history.push(1);
        elements.push(ev.detail);
    });
    const beforeUpdate = mock(function (this: HTMLElement, ev: CustomEvent<HTMLElement>) {
        expect(ev).toBeInstanceOf(CustomEvent);
        expect(ev.type).toBe("beforeupdate");
        expect(this).toBe(ev.detail);
        expect(pureNodes(document.body.childNodes)).toContain(pureNode(ev.detail));
        history.push(2);
        elements.push(ev.detail);
    });
    const update = mock(function (this: HTMLElement, ev: CustomEvent<HTMLElement>) {
        expect(ev).toBeInstanceOf(CustomEvent);
        expect(ev.type).toBe("update");
        expect(this).toBe(ev.detail);
        expect(pureNodes(document.body.childNodes)).toContain(pureNode(ev.detail));
        history.push(3);
        elements.push(ev.detail);
    });
    const beforeUnmount = mock(function (this: HTMLElement, ev: CustomEvent<HTMLElement>) {
        expect(ev).toBeInstanceOf(CustomEvent);
        expect(ev.type).toBe("beforeunmount");
        expect(this).toBe(ev.detail);
        expect(pureNodes(document.body.childNodes)).toContain(pureNode(ev.detail));
        history.push(4);
        elements.push(ev.detail);
    });
    const unmount = mock(() => {
        expect(pureNodes(document.body.childNodes)).not.toContain(pureNode(elements[0]));
        history.push(5);
    });

    
    const checkMount = () => {
        expect(beforeMount).toHaveBeenCalledTimes(1);
        expect(beforeMount).toHaveBeenCalledWith();
        expect(mount).toHaveBeenCalledTimes(1);
    }
    const checkUpdate = () => {
        expect(beforeUpdate).toHaveBeenCalledTimes(1);
        expect(update).toHaveBeenCalledTimes(1);
    }
    const checkUnmount = () => {
        expect(beforeUnmount).toHaveBeenCalledTimes(1);
        expect(unmount).toHaveBeenCalledTimes(1);
        expect(unmount).toHaveBeenCalledWith();
    }

    render(<div
        $beforeMount={beforeMount}
        $mount={mount}
        $beforeUpdate={beforeUpdate}
        $update={update}
        $beforeUnmount={beforeUnmount}
        $unmount={unmount}
    />);

    expect(history).toEqual([0, 1]);
    expect(elements).toHaveLength(1);
    checkMount();

    render(<div
        $beforeMount={beforeMount}
        $mount={mount}
        $beforeUpdate={beforeUpdate}
        $update={update}
        $beforeUnmount={beforeUnmount}
        $unmount={unmount}
    >
        Hey!
    </div>);

    expect(history).toEqual([0, 1, 2, 3]);
    expect(elements).toHaveLength(3);
    checkMount();
    checkUpdate();

    render(<></>);

    expect(history).toEqual([0, 1, 2, 3, 4, 5]);
    expect(elements).toHaveLength(4);
    checkMount();
    checkUpdate();
    checkUnmount();

    expect(elements[0]).toBeInstanceOf(HTMLElement);
    expect(elements.every(e=>elements[0] === e)).toBeTrue();
});
