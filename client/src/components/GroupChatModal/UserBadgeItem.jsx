import { Box } from '@chakra-ui/react';
import { } from 'react';
import { Badge } from 'react-bootstrap';
import { AiOutlineClose } from "react-icons/ai";



function UserBadgeItem({ user, onDelete }) {

    const arr = ["green.600", "orange.600", "blue.600", "pink.600", "yellow.600", "cyan.600", "purple.600"];

    const item = arr[Math.floor(Math.random() * arr.length)];

    return <>
        <Box
            width="fit-content"
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            bg={item}
            color="white"
            cursor="pointer"
            onClick={onDelete}
            display="inline"
        ><span>{user.name}<AiOutlineClose style={{ display: "inline", fontSize: "1.2em" }} /></span></Box>
    </>
}

export default UserBadgeItem;
