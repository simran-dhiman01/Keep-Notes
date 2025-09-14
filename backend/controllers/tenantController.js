import Tenant from "../models/Tenant.js";


// Only Admin can do this
export const upgradePlan = async (req, res) => {
    try {
        const { slug } = req.params;
        const tenant = await Tenant.findOne({ slug });
        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found",
            });
        }
        if (tenant._id.toString() !== req.user.tenantId._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to upgrade this tenant",
            });
        }
        if (tenant.plan === "pro") {
            return res.status(200).json({
                success: true,
                message: "Tenant is already on Pro plan",
            });
        }
        tenant.plan = "pro";
        await tenant.save();

        return res.status(200).json({
            success: true,
            message: "Plan upgraded to Pro successfully",
            tenant: {
                id: tenant._id,
                slug: tenant.slug,
                plan: tenant.plan,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

