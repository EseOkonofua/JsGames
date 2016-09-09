function inheritPrototype(childObject,parentObject){
  var pCopy = Object.create(parentObject.prototype);
  pCopy.constructor = childObject;
  childObject.prototype = pCopy;
}
