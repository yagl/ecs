Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fastBind = fastBind;

function fastBind(thisArg, methodFunc) {
  return function () {
    methodFunc.apply(thisArg, arguments);
  };
}