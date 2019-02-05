import * as React from "react";
import { Box, Button, Flex } from "@rebass/emotion";
import { NavBarHolder, AvatarImg, BoldText, Text, Label } from "../design-system/primitives";
import { unsetToken, getUserFromLocalCookie } from "../../utils/auth";
import { logout } from "../../utils/auth0";
import { useMedia } from "the-platform";
import { useState, useEffect } from "react";
import Link from "next/link";
import AvatarPopup from "./AvatarPopup";
import Router from "next/router";
import { css } from "@emotion/core";

const NavBar: React.SFC = () => {
  const small = useMedia("(max-width: 639px)");
  const user = getUserFromLocalCookie();
  const [isNavPopup, setIsNavPopup] = useState(false);
  const Links = small ? (
    <Flex width={1}>
      <Box mx={3}>
        <Link href="/classes">
          <Text fontSize = {3} color="white">classes</Text>
        </Link>
      </Box>
      <Box mx={3}>
        <Link href="/quizzes">
          <Text fontSize={3} color="white">quizzes</Text>
        </Link>
      </Box>
    </Flex>
  ) : null;

  return (
    <NavBarHolder css={{ position: "relative" }}>
      {Links}
      <Flex
        flexDirection="row"
        css={css`
          width: auto;
        `}
      >
        <Label fontSize={1} fontWeight={0}>
          {JSON.stringify(Router.pathname.split('/').join(' > ')).replace(/\"/g, "")}
        </Label>
      </Flex>
      <AvatarImg
        mr={4}
        onClick={() => setIsNavPopup(!isNavPopup)}
        src={user && user.picture ? user.picture : ""}
        alt="profile"
      />

      <AvatarPopup isNavPopup={isNavPopup} />
    </NavBarHolder>
  );
};

export default NavBar;
