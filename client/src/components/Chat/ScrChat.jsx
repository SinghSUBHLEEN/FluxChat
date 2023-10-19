import { useState } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "./chatLogic";
import cookie from 'js-cookie';
import { Avatar, Tooltip } from '@chakra-ui/react';

function ScrChat({ messages }) {


    const [id, setid] = useState(cookie.get("_id"));

    return (<ScrollableFeed>
        {messages &&
            messages.map((m, i) => (
                <div style={{ display: "flex" }} key={m._id}>
                    {(isSameSender(messages, m, i, id) ||
                        isLastMessage(messages, i, id)) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.profile}
                                />
                            </Tooltip>
                        )}
                    <span
                        style={{
                            backgroundColor: `${m.sender._id === id ? "#3797f0" : "#262626"
                                }`,
                            marginLeft: isSameSenderMargin(messages, m, i, id),
                            marginTop: isSameUser(messages, m, i, id) ? 3 : 10,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                        }}
                    >
                        {m.content}
                    </span>
                </div>
            ))}
    </ScrollableFeed>)
}

export default ScrChat;
