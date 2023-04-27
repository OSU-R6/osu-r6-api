/*
* Schema for a User
*/
const UserSchema = {
    name:               { required: true },
    email:		        { required: true },
    password:	        { required: true },
	admin:		        { required: false },
    comments:           { required: false },
    status:             { required: true }
};
exports.UserSchema = UserSchema;