const jwt = require("jsonwebtoken");
const token = "Nzg4NGYyMGNjNDIwMDBh.NjQyNmU3OTg=.Z9i_8eOELc_trnu7kxI3pttrj_E";

const decoded = jwt.decode(token);
console.log(decoded);
