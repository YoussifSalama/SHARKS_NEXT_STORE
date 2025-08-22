"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const FloatingWhatsApp = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const phoneNumber = "1234567890";
        const fullMessage = name ? `Hi, I'm ${name}. ${message}` : message;
        const encodedMessage = encodeURIComponent(fullMessage);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, "_blank");
        setIsOpen(false);
        setMessage("");
        setName("");
    };

    return (
        <>
            {/* Floating Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                size="icon"
            >
                <MessageCircle className="h-6 w-6 text-white" />
            </Button>

            {/* WhatsApp Card Popup */}
            {isOpen && (
                <div className="fixed bottom-25 right-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-3 text-[#25D366]">
                            <div className="h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center">
                                <MessageCircle className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-semibold">Start WhatsApp Chat</span>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="p-4 space-y-3">
                        <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-[#25D366] text-sm text-muted-foreground">
                            👋 Hi there! How can we help you today?
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Your Name (Optional)
                            </label>
                            <Input
                                placeholder="Enter your name..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Message *
                            </label>
                            <Textarea
                                placeholder="Type your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="mt-1 min-h-[100px] resize-none"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white"
                            >
                                Chat on WhatsApp
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingWhatsApp;
