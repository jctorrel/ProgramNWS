import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatWindow({ messages, isTyping }) {
    return (
        <div className="rounded-[22px] p-2.5 bg-white border border-gray-200 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
            {messages && messages.length > 0 ? (
                messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex my-0.5 ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                    <div
                        className={`
                            max-w-[78%] px-2.5 py-2 rounded-xl text-[13px] leading-relaxed
                            border shadow-[0_4px_10px_rgba(15,23,42,0.04)] break-words
                            ${msg.sender === "user" ? "whitespace-pre-wrap" : ""}
                            ${
                                msg.sender === "user"
                                    ? "bg-gradient-to-br from-nws-yellow/16 to-nws-teal/26 text-gray-900 rounded-tr-xxl rounded-br-md border-yellow-300/70"
                                    : "bg-gray-50 rounded-tl-xxl rounded-tr-xl rounded-bl-xl rounded-br-md border-gray-200"
                            }
                        `}
                    >
                        {msg.sender === "mentor" && (
                            <span className="block text-[10px] uppercase tracking-[0.14em] text-nws-purple mb-0.5">
                                Mentor
                            </span>
                        )}
                        <MessageContent text={msg.content} sender={msg.sender} />
                    </div>
                </div>
            ))
            ) : (
                <div className="text-center text-gray-400 py-8">
                    Aucun message pour le moment...
                </div>
            )}

            {isTyping && (
                <div className="flex justify-start my-0.5">
                    <div className="max-w-[78%] px-2.5 py-2 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="inline-flex gap-[3px] items-center text-xs text-gray-500">
                            <span className="w-1 h-1 rounded-full bg-nws-purple opacity-40 typing-dot" />
                            <span className="w-1 h-1 rounded-full bg-nws-purple opacity-40 typing-dot" />
                            <span className="w-1 h-1 rounded-full bg-nws-purple opacity-40 typing-dot" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function MessageContent({ text, sender }) {
    if (!text) {
        return <span></span>;
    }

    if (sender !== "mentor") {
        return <span>{text}</span>;
    }

    return (
        <div className="whitespace-normal markdown-lists">
            <style>{`
                /* Compteur global pour les listes de premier niveau */
                .markdown-lists {
                    counter-reset: main-counter;
                }
                
                /* Listes OL de premier niveau : utiliser le compteur personnalisé */
                .markdown-lists > ol {
                    counter-reset: none;
                }
                
                .markdown-lists > ol > li {
                    list-style: none;
                    counter-increment: main-counter;
                }
                
                .markdown-lists > ol > li::before {
                    content: counter(main-counter) ". ";
                    font-weight: normal;
                    margin-right: 0.25rem;
                }
                
                /* Listes imbriquées OL dans OL : lettres minuscules */
                .markdown-lists ol ol {
                    list-style-type: lower-alpha;
                    padding-left: 1.25rem;
                }
                
                /* Listes imbriquées OL dans OL dans OL : chiffres romains */
                .markdown-lists ol ol ol {
                    list-style-type: lower-roman;
                }
                
                /* Listes UL dans OL : puces */
                .markdown-lists ol ul {
                    list-style-type: disc;
                    padding-left: 1.25rem;
                }
                
                /* Listes OL dans UL : chiffres */
                .markdown-lists ul ol {
                    list-style-type: decimal;
                    padding-left: 1.25rem;
                }
                
                /* Listes UL de base */
                .markdown-lists ul {
                    list-style-type: disc;
                }
                
                /* Listes UL dans UL : cercles */
                .markdown-lists ul ul {
                    list-style-type: circle;
                    padding-left: 1.25rem;
                }
                
                /* Listes UL dans UL dans UL : carrés */
                .markdown-lists ol ul ol {
                    list-style-type: square;
                }
            `}</style>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: function(props) {
                        return <a href={props.href} target="_blank" rel="noopener noreferrer" className="text-nws-purple no-underline border-b border-nws-purple/30 hover:border-nws-purple/80 transition-colors">{props.children}</a>;
                    },
                    code: function(props) {
                        const isInline = !props.className;
                        if (isInline) {
                            return <code className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-gray-900 border border-indigo-300/50 text-nws-yellow">{props.children}</code>;
                        }
                        return <code className="block font-mono text-[11px] p-2 rounded-lg bg-gray-900 border border-indigo-300/50 text-nws-yellow overflow-x-auto my-1.5 whitespace-pre">{props.children}</code>;
                    },
                    pre: function(props) {
                        return <pre className="my-1.5 rounded-lg overflow-hidden">{props.children}</pre>;
                    },
                    h1: function(props) {
                        return <h1 className="text-base font-bold text-gray-900 mt-2.5 mb-1">{props.children}</h1>;
                    },
                    h2: function(props) {
                        return <h2 className="text-[14px] font-bold text-gray-900 mt-2 mb-0.5">{props.children}</h2>;
                    },
                    h3: function(props) {
                        return <h3 className="text-[13px] font-semibold text-gray-900 mt-1.5 mb-0.5">{props.children}</h3>;
                    },
                    ul: function(props) {
                        return <ul className="my-1 space-y-1 pl-10">{props.children}</ul>;
                    },
                    ol: function(props) {
                        return <ol className="my-1 space-y-1">{props.children}</ol>;
                    },
                    li: function(props) {
                        return <li className="text-[13px] leading-snug">{props.children}</li>;
                    },
                    p: function(props) {
                        return <p className="my-1 leading-normal">{props.children}</p>;
                    },
                    strong: function(props) {
                        return <strong className="font-semibold text-gray-900">{props.children}</strong>;
                    },
                    em: function(props) {
                        return <em className="italic">{props.children}</em>;
                    },
                    blockquote: function(props) {
                        return <blockquote className="border-l-3 border-nws-purple/40 pl-3 my-1.5 italic text-gray-600">{props.children}</blockquote>;
                    },
                    table: function(props) {
                        return <div className="overflow-x-auto my-1.5"><table className="min-w-full border border-gray-200 rounded">{props.children}</table></div>;
                    },
                    th: function(props) {
                        return <th className="border border-gray-200 px-2 py-1 bg-gray-100 text-left text-[12px] font-semibold">{props.children}</th>;
                    },
                    td: function(props) {
                        return <td className="border border-gray-200 px-2 py-1 text-[12px]">{props.children}</td>;
                    }
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
}

export default ChatWindow;