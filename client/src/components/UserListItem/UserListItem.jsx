import { } from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";

function UserListItem({ handleOnClick, user }) {


    // console.log(typeof (handleFunction));

    return (<>
        <Box
            onClick={handleOnClick}
            cursor="pointer"
            _hover={{ backgroundColor: "rgba(99,179,237, 0.7)" }}
            bg="whiteAlpha.200"
            w="100%"
            d="flex"
            alignItems="center"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
            borderWidth="medium"
            borderColor="blackAlpha.200"
        >
            <Avatar
                mr={2}
                size='sm'
                cursor="pointer"
                name={user.name}
                src={user.profile}
            />
            <Box display="inline" px="3" style={{ marginTop: "auto", marginBottom: "auto" }}>
                <span style={{ color: 'white', fontWeight: "500", fontSize: "large" }}>
                    {user.name}
                </span>
            </Box>
        </Box>
    </>)
}

export default UserListItem
