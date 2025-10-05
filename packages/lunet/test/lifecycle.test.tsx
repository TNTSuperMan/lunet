import { test, expect, mock } from "bun:test";
import { withRender } from "./utils/withRender";
import { h, fragment } from "../src";

test("Test lifecycle events", () => {
    const render = withRender();

    const history: number[] = [];
    const elements: HTMLElement[] = [];

    const beforeMount = mock(() => {
        history.push(0);
    });
    const mount = mock((ev: CustomEvent<HTMLElement>) => {
        expect(ev).toBeObject();
        expect(ev.type).toBe("mount");
        // メモ: 要素の$mount時点では親要素に追加されていない、多分今後のTODO
        history.push(1);
        elements.push(ev.detail);
    });
    const beforeUpdate = mock((ev: CustomEvent<HTMLElement>) => {
        expect(ev).toBeObject();
        expect(ev.type).toBe("beforeupdate");
        expect(document.body.childNodes).toContain(ev.detail);
        history.push(2);
        elements.push(ev.detail);
    });
    const update = mock((ev: CustomEvent<HTMLElement>) => {
        expect(ev).toBeObject();
        expect(ev.type).toBe("update");
        expect(document.body.childNodes).toContain(ev.detail);
        history.push(3);
        elements.push(ev.detail);
    });
    const beforeUnmount = mock((ev: CustomEvent<HTMLElement>) => {
        expect(ev).toBeObject();
        expect(ev.type).toBe("beforeunmount");
        expect(document.body.childNodes).toContain(ev.detail);
        history.push(4);
        elements.push(ev.detail);
    });
    const unmount = mock(() => {
        expect(document.body.childNodes).not.toContain(elements[0]);
        history.push(5);
    });

    
    const checkMount = () => {
        expect(beforeMount).toBeCalledTimes(1);
        expect(beforeMount).toBeCalledWith();
        expect(mount).toBeCalledTimes(1);
    }
    const checkUpdate = () => {
        expect(beforeUpdate).toBeCalledTimes(1);
        expect(update).toBeCalledTimes(1);
    }
    const checkUnmount = () => {
        expect(beforeUnmount).toBeCalledTimes(1);
        expect(unmount).toBeCalledTimes(1);
        expect(unmount).toBeCalledWith();
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

    expect(elements[0]).toBeObject();
    expect(elements.every(e=>elements[0] === e)).toBeTrue();
});
