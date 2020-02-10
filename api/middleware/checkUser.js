
module.exports = (users) => {

        return (req,res,next) => {

            const role = req.tokenData.role;
            const allowedusers = users.split(",")
            let flag = false;
            
            for(const u of allowedusers){

                if(role === u) flag = true; 

            }
            
            if(flag) next();
            else res.status(500).json({message: 'Access Denied !'});
            
        }
        
    }
