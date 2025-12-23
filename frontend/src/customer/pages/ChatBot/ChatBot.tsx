import React, { useEffect, useRef, useState } from "react";

import { Box, Button, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { useSelector } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import PromptMessage from "./PromptMessage";
import ResponseMessage from "./ResponseMessage";
import { chatBot } from "../../../State/customer/AiChatBotSlice";

interface ChatBotProps{
    handleClose:(e:any)=>void;
    productId?:number
}

const ChatBot = ({handleClose,productId}:ChatBotProps) => {
    const dispatch = useAppDispatch();
    const [prompt, setPrompt] = useState<string | undefined>(undefined);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [responses, setResponses] = useState<any>([]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const {aiChatBot}=useAppSelector(store=>store);

    const handleGivePrompt = async (e: any) => {
    e.stopPropagation();
    setError(undefined);
    setLoading(true);
    try {
        await dispatch(chatBot({ prompt: { prompt }, productId, userId: null }));
    } catch (err: any) {
        setError("Failed to get response from AI. Please try again.");
        // Log error for debugging
        console.error("ChatBot error:", err);
    }
    setLoading(false);
    setPrompt(""); // Clear input after sending
};

    const handlePromptChange = (e: any) => {
        
        setPrompt(e.target.value);
    };
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [aiChatBot.messages]);
    // console.log(aiChatBot)
    return (
        <div className="rounded-lg">
            <div className="w-full lg:w-[40vw] h-[82vh] shadow-2xl bg-white z-50 rounded-lg">
                <div className=" h-[12%] flex justify-between items-center px-5 bg-slate-100 rounded-t-lg">
                    <div className="flex items-center gap-3 ">
                        <h1 className="logo">vaibhav Bazzar</h1>
                        <p>Assitant</p>
                    </div>
                   {/* {productId && <div className="flex items-center gap-3">
                        <p>Product id :</p>
                        <p>{productId}</p>
                    </div>} */}
                    <div>
                        <IconButton 
                        onClick={handleClose}
                        color="primary"
                       
                        >
                            <CloseIcon/>
                        </IconButton>
                    </div>

                </div>

                <div className="h-[78%] p-5 flex flex-col py-5 px-5 overflow-y-auto  custom-scrollbar">

                    <p>welcome to vaibhav Bazzar Ai Assistant, you can
                      {productId?` Query About this Product : ${productId}`:"   Query about your cart, and order history here"}
                    </p>
                    {aiChatBot.error && (
                        <p className="text-red-500 font-semibold mt-2">{aiChatBot.error}</p>
                    )}
                    { aiChatBot.messages.map((item:any, index:number) =>
                        item.role == "user" ? (
                            <div ref={chatContainerRef} className="self-end" key={index}>
                                <PromptMessage message={item.message} index={index} />
                            </div>
                        ) : (
                            <div
                                ref={chatContainerRef}
                                className="self-start"
                                key={index}
                            >
                                <ResponseMessage message={item.message} />
                            </div>
                        )
                    )}
                    {aiChatBot.loading && <p>fetching data...</p>}

                </div>

                <div className=" h-[10%] flex items-center">
                    <input
                        value={prompt || ""}
                        onChange={handlePromptChange}
                        type="text"
                        placeholder="give your prompt"
                        className="rounded-bl-lg pl-5 h-full w-full bg-slate-100 border-none outline-none"
                        disabled={loading}
                    />
                    <Button
                        sx={{ borderRadius: "0 0 0.5rem 0" }}
                        className="h-full "
                        onClick={handleGivePrompt}
                        variant="contained"
                        disabled={loading || !prompt}
                    >
                        <SendIcon />
                    </Button>
                </div>
                {error && (
                    <div className="text-red-600 px-4 py-2">{error}</div>
                )}
            </div>
        </div>
    );
};

export default ChatBot;
