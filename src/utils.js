
export function fastBind(thisArg, methodFunc) {
  return function () {
    methodFunc.apply(thisArg, arguments);
  };
}