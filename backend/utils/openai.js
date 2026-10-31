import "dotenv/config.js"


const getOpenAiResponse = async(message)=>{
    
       const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
            },
            body: JSON.stringify({
                model: "openrouter/free",
                messages: 
                [{ role: "user", 
                    content: message
                }],
            })
        };
    


        try{  
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions",options) 
        const data = await response.json();
        console.log("API Response:", data);
        return data.choices[0].message.content;  // from this is we got our reply 
     }catch (e) {
        console.log("Catch Error:", e);
    }

}
export default getOpenAiResponse;