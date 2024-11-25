class ApiError extends Error{
              constructor(statusCode,message="Something went wrong",errors=[]){
                super(message)
                this.message=message
                this.statusCode=statusCode
                this.name = this.constructor.name;
              }
}

export {ApiError}