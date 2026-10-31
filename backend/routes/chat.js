
import express from 'express'
import Thread from "../models/Thread.js"
import getOpenAiResponse from "../utils/openai.js"
const router = express.Router();

const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: "Please login first" });
    }
    next();
};


//test
router.post("/test", requireAuth, async(req,res)=>{
    
    try{
        const thread = new Thread({
            threadId: "xyzff",
            title: "testing newthreadfffffffff",
            userId: req.user._id
        })
        const response = await thread.save()
        res.send(response)


    }catch(err){
        console.log("Error in test Route",err)
        res.status(500).json({error:"Failed to save in DB"})
    }
})


// to get all threads
router.get("/thread", requireAuth, async(req,res)=>{
    try{
        const threads = await Thread.find({
            userId: req.user._id
        }).sort({updatedAt:-1})
        //descending order of updated at 
        res.json(threads);
    }catch(e){
        console.log(e);
         res.status(500).json({error:"Failed to fetch threads"})
    }
})


router.get("/thread/:threadId", requireAuth, async(req,res)=>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({
            threadId,
            userId: req.user._id
        });
        if(!thread) {
            return res.status(404).json({error:"Thread is not Found"});
        }
        res.json(thread.messages)

    }catch(e){
        console.log(e);
        res.status(500).json({error:"Failed to fetch thread/id"})
    }
})


//deletee Routee

router.delete("/thread/:threadId", requireAuth, async(req,res)=>{
    const {threadId} = req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({
            threadId,
            userId: req.user._id
        });
        if(!deletedThread){
            return res.status(404).json({error:"Thread Could Not deleted"})
        }
        res.status(200).json({success:"SuccessFully deleted"})
    }catch(e){
        console.log("Error in the delte Route",e)
        res.status(500).json({error:"Failed To detlete "})
    }
})

// 
router.post("/chat", requireAuth, async(req, res) => {
    const { threadId, message } = req.body;

    if(!threadId || !message) {
        return res.status(400).json({error: "missing required fields"});
    }

    try {
        const assistantReply = await getOpenAiResponse(message);

        // Atomic upsert: agar thread nahi hai toh ban jayega, hai toh messages push ho jayenge
        const thread = await Thread.findOneAndUpdate(
            {
                threadId,
                userId: req.user._id
            },
            { 
                $set: { 
                    title: message.trim().split(/\s+/).slice(0, 6).join(" "),
                    updatedAt: new Date() 
                },
                $push: { 
                    messages: { 
                        $each: [
                            { role: "user", content: message },
                            { role: "assistant", content: assistantReply }
                        ] 
                    } 
                } 
            },
            { new: true, upsert: true }
        );

        res.json({ reply: assistantReply });
    } catch(err) {
        console.log("Chat route error:", err);
        res.status(500).json({error: "something went wrong"});
    }
});

export default router;
