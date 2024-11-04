const React = (() => {
    const hooks = []
    let currentHook = 0

    function useState(initialValue) {
        // freezing current hook (since global one would change)
        const _currentHook = currentHook;

        // if we don't already have a value for this hook, then initializing the value
        hooks[currentHook] = hooks[currentHook] || initialValue;
        
        const state = hooks[_currentHook];
        
        const setState = (value) => {
            const oldValue = hooks[_currentHook];

            // if the value is changed, then we need to render
            if(!Object.is(oldValue, value)) {
                // rendering logic here
            }

            // updating the hook value
            hooks[_currentHook] = value;
        }

        // incrementing the hook index for next hook
        currentHook++;

        // returning state, setstate like react does
        return [state, setState];
    }

    function useEffect(cb, newDeps) {
        const oldDeps = hooks[currentHook][0];
        const oldCleanup = hooks[currentHook][1];

        if(oldCleanup) {
            oldCleanup.call();
        }

        // checking if dependencies have changed
        let hasChanged = true;
        if(oldDeps) {
            // looping over old deps, to check if some new ones are different
            // Note: using Object.is instead of === because of its wierd behaviour like NaN === NaN returns false
            hasChanged = oldDeps.some((dep, indx) => !Object.is(dep, newDeps[indx]))
        }

        // if deps changed then calling call back function and updating hook value
        if(hasChanged) {
            const cleanup = cb();
            // storing the new deps
            hooks[currentHook] = [newDeps, cleanup];
        }

        currentHook++;
    }

    function render(Component, props) {
        // component returns jsx
        const JSX = Component(props);
        // rendering jsx on dom
    }

    return {
        useState,
        useEffect
    }
})()

const Component = () => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        console.log('count has changed');
    }, [count])

    return <main>
        <h1>Hooks Clone</h1>
        <button onClick={() => setCount(count+1)}>Click Me {count}</button>
    </main>
}