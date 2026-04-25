import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  ChevronLeft,
  Trash2,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Airecommendation = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // User Data and ID Logic
  const userData = JSON.parse(localStorage.getItem("user"));
  const userName = userData ? userData.username : "Customer";

  // userId logic: Login అయితే email/mobile, లేకపోతే ఒక unique UUID జనరేట్ చేసి సేవ్ చేస్తుంది
  const [userId] = useState(() => {
    if (userData) return userData.email || userData.mobile;
    let guestId = localStorage.getItem("chatUserId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("chatUserId", guestId);
    }
    return guestId;
  });

  const chatKey = `chat_history_${userId}`;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(chatKey);
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "bot",
            isIntroduction: true,
            text: `హలో ${userName} గారు! Anil Shopyfy లో షాపింగ్ చేస్తున్నందుకు మా యజమాని అనిల్ కుమార్ గారు మీకు ప్రత్యేక ధన్యవాదాలు తెలియజేయమన్నారు. 🙏\n\nనేను అనిల్ గారి పర్సనల్ AI ఏజెంట్‌ని. మీకు కావాల్సిన బెస్ట్ ప్రొడక్ట్స్ వెతకడంలో నేను సహాయపడతాను. ఏం కావాలి మీకు?`,
          },
        ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(chatKey, JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatKey]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const textToSend = input;
    setInput("");

    try {
      const response = await axios.post(
        "https://anil-shopyfy-backend.onrender.com/api/ai/recommend",
        {
          message: textToSend,
          userName: userName,
          userId: userId, // పంపాల్సిన userId ఇక్కడ యాడ్ చేశాను
        },
      );

      const botMsg = {
        role: "bot",
        text: response.data.reply,
        productId: response.data.recommendedProductId,
        productName: response.data.productName,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "క్షమించు, సర్వర్ అందుబాటులో లేదు! 🛠️" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-slate-100 min-h-[calc(100vh-80px)] w-full items-center justify-start p-2 sm:p-6">
      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden border border-gray-200 h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-orange-50 rounded-full transition-colors text-orange-600"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h2 className="font-black text-lg uppercase tracking-tighter">
                Anil <span className="text-orange-600">AI Stylist</span>
              </h2>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Agent Active
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Clear this chat?")) {
                localStorage.removeItem(chatKey);
                window.location.reload();
              }
            }}
            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-slate-50/50 custom-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3`}
            >
              <div
                className={`flex gap-3 max-w-[95%] sm:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Profile Icons / Photos */}
                <div className="shrink-0 flex flex-col items-center justify-start">
                  <div
                    className={`rounded-2xl shadow-md overflow-hidden border-2 ${msg.role === "user" ? "w-10 h-10 bg-orange-600 border-orange-500" : "w-14 h-14 bg-white border-white"}`}
                  >
                    {msg.role === "user" ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                    ) : (
                      <img
                        src="/aboutusimage-anil.jpg"
                        alt="Anil"
                        className="w-full h-full object-cover shadow-inner"
                        onError={(e) =>
                          (e.target.src =
                            "https://cdn-icons-png.flaticon.com/512/4712/4712027.png")
                        }
                      />
                    )}
                  </div>
                </div>

                {/* Bubble Area */}
                <div
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  {msg.isIntroduction && (
                    <div className="flex items-center gap-1 mb-1 ml-1">
                      <Sparkles
                        size={12}
                        className="text-orange-500 fill-orange-500"
                      />
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                        Official Greeting
                      </span>
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl shadow-sm ${msg.role === "user" ? "bg-orange-600 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}
                  >
                    <p className="text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>

                    {/* Product Card */}
                    {msg.productId && (
                      <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl p-3 shadow-inner">
                        <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">
                          Recommended for you
                        </p>
                        <h4 className="text-sm font-bold text-gray-800 mb-3">
                          {msg.productName}
                        </h4>
                        <button
                          onClick={() =>
                            navigate(`/eachproductroute/${msg.productId}`)
                          }
                          className="w-full py-2.5 bg-orange-600 text-white text-[11px] font-black uppercase rounded-lg hover:bg-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-100"
                        >
                          View Product Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border shadow-sm w-fit animate-pulse">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase italic">
                Thinking...
              </span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 sm:p-6 bg-white border-t shrink-0">
          <div className="max-w-3xl mx-auto flex items-center gap-3 bg-slate-100 rounded-[1.5rem] p-2 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-50 border border-transparent focus-within:border-orange-100 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="మీకు ఏం కావాలో ఇక్కడ అడగండి..."
              className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold text-gray-700"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 disabled:bg-gray-200 transition-all active:scale-90 shadow-lg"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airecommendation;
