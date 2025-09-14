import Note from "../models/Note.js";

export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title?.trim() && !content?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title or content is required",
            });
        }

        const tenantId = req.user.tenantId._id;
        if (req.user.tenantId.plan === "free") {
            const noteCount = await Note.countDocuments({ tenantId });
            if (noteCount >= 3) {
                return res.status(403).json({
                    success: false,
                    message: "Free plan limit reached. Please upgrade to Pro.",
                });
            }
        }
        const note = await Note.create({
            title: title.trim(),
            content: content.trim(),
            tenantId,
            userId: req.user._id,
        });
        return res.status(201).json({
            success: true,
            note,
        });
    } catch (error) {
        console.error("Error occured while creating Note:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getNotes = async (req, res) => {
    try {
        const tenantId = req.user.tenantId._id;
        const notes = await Note.find({ tenantId }).populate("userId", "email role");

        return res.status(200).json({
            success: true,
            count: notes.length,
            notes,
        });
    } catch (error) {
        console.error("Error occurred while fetching notes:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }
        // Tenant isolation check
        if (note.tenantId.toString() !== req.user.tenantId._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this note",
            });
        }

        return res.status(200).json({
            success: true,
            note,
        });
    } catch (error) {
        console.error("Error occurred while fetching note by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }
        // Tenant isolation check
        if (note.tenantId.toString() !== req.user.tenantId._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this note",
            });
        }

        if (note.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own notes",
            });
        }

        note.title = title || note.title;
        note.content = content || note.content;

        await note.save();
        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note,
        });
    } catch (error) {
        console.error("Error occurred while updating note:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        // Tenant isolation check
        if (note.tenantId.toString() !== req.user.tenantId._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this note",
            });
        }

        // only the creator can delete
        if (note.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own notes",
            });
        }
        await note.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        });
    } catch (error) {
        console.error("Error occurred while deleting note:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}