import * as React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import {
  BoxHolder,
  Emblem,
  BoxText,
  UniButton
} from "../../design-system/primitives";
import { Flex, Box } from "@rebass/emotion";
import { css } from "@emotion/core";

//to get the quizzes to map through all you need is the
//quiz prop from the app page.
const StudentBox = ({ id, student }) => {
  return (
    <>
      <BoxHolder
      css={css`
      border-bottom:5px solid #70e89d;
      position:relative;
      transform-style: preserve-3d;
      transition: all 600ms;
      &:hover{
        transform:rotateX(180deg);
      }

      `}
      >
      <div
      css={css`
      position:relative;
      backface-visibility:hidden;
      `}>
          <Box
           m={1}
           >
            <Flex
            flexDirection="row"
            justifyContent="space-between"
            >
            <BoxText fontWeight={1}>
              {" "}
              {student.first_name} {student.last_name}
            </BoxText>
            <UniButton fontSize={0} bg="blue.2">Delete</UniButton>
            </Flex>
            </Box>
            <Box
            p={1}
            css={css`
            border-top:1px solid #B5FFD0;
            `}
            >
            <BoxText fontWeight={1}>
            {student.email}
            </BoxText>
            <Flex
            flexDirection="row"
            justifyContent="space-between"
            mt={1}
            p={1}
            css={css`
            border-top:1px solid #B5FFD0;
            `}
            >
            <UniButton bg="green.1" fontSize={0}>Edit</UniButton>
            <UniButton bg="blue.5" fontSize={0}>View Results</UniButton>
            </Flex>
          </Box>
          </div>
          <Box
          bg="blue.0"
          css={css`
          transform: rotateX(180deg);
          backface-visibility:hidden;
          `}
          >
            <BoxText>Back</BoxText>
            <BoxText>Back</BoxText>

          </Box>
      </BoxHolder>
    </>
  );
};
export default StudentBox;
