import { Box, Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

function SkeletonCustom() {
    return <>
        <Box display="flex" justifyItems="center" justifyContent="center" m={2}>
            <span><SkeletonCircle size='10' startColor="red.200" endColor='yellow.50' /></span>
            <SkeletonText mt='1' mx={2} noOfLines={3} spacing='3' skeletonHeight='2' startColor="red.200" endColor='yellow.50' width="92%" />
        </Box>
    </>
}

export default SkeletonCustom;
