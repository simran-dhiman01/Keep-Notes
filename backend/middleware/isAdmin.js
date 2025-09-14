export const isAdmin = (req,res,next) => {
    if(req.user.role !== 'admin'){
        return res.status(403).json({ message: "Admins only" });
    }
    next();
}

export const isMember = (req,res,next) => {
    if(req.user.role !== 'member'){
        return res.status(403).json({ message: "Members only" });
    }
    next();
}