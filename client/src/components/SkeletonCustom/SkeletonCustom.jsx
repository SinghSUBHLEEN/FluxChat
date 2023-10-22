import { Box, Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

function SkeletonCustom() {
    return <>
        <Box display="flex" justifyItems="center" justifyContent="center" m={2}>
            <span style={{ paddingTop: "5px" }}><SkeletonCircle size='10' startColor='whiteAlpha.500' endColor='whiteAlpha.300' /></span>
            <SkeletonText mt='1' mx={2} startColor='whiteAlpha.500' endColor='whiteAlpha.300' noOfLines={3} spacing='3' skeletonHeight='2' width="92%" />
        </Box>
    </>
}

export default SkeletonCustom;
