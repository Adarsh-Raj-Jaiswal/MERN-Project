module.exports = (func) => { // higher order function which is taking func as argument and returning a function
    return (req, res, next) => { // this anonymous function is returned by the higher order function

        // this function wraps the argument received by the higher order function into Promise.resolve
        Promise.resolve( // called with the result of func(req, res, next) as the argument. If the result is already a promise, it is returned as is. If the result is a non-promise value, Promise.resolve() wraps it into a resolved promise.

            // represents an asynchronous function
            func(req, res, next)// is invoked, which returns a promise or a value
        ).catch(next); // if there is some error in resolving the promise it is catched and forwarded to next
    };
    // A closure is created when an inner function ((req, res, next) => { ... }) references variables from its outer function ((func) => { ... }) that are no longer in scope. In this case, the inner function captures the func parameter from its outer function, even after the outer function has finished executing.
};

// short code

// module.exports = func => (req, res, next) => {
//     Promise.resolve(func(req, res, next)).catch(next);
// }


// expanded code

// module.exports = (func) => {
//     return (req, res, next) => {
//         Promise.resolve(
//             func(req, res, next)
//         ).catch(next);
//     };
// };