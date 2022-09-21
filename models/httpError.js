//This class extends built-in JavaScript Error method
class HttpError extends Error{
    constructor(message, errorCode){
        super(message); //Add a 'message' property
        this.code = errorCode; //Adds a 'code' property. basically we plan to use 404(Not found).
    }
}

module.exports = HttpError;