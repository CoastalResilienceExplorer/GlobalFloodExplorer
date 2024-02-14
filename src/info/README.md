## useInfo

This reducer function is designed to enable popups and visualization changes every time an action happens.

To add a new event:

1. Add a new key to `initialInfo.js`
2. Add a new action to `infoReducer.js`
3. Link the trigger to a ref in `useInfo
4. Import the appropriate event trigger from `useInfoContext`. ie `useFirst` for only the first time an event happens, `useWhile`, `useEvery`
5. Fire the event trigger according to some state change
6. Attach the ref to the appropriate DOM element.

Notes:

- Generally, initially state is `null`, and indicates that the event can happen.
- `true` indicates that an event is active.
- Events that have happened and shouldn't happen again should be set to `false`.
- If an event should potentially happen again, it should be set back to `null`
