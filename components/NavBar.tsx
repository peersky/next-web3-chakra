import React, { useContext } from "react";
import RouterLink from "next/link";
import {
  Button,
  Image,
  ButtonGroup,
  Spacer,
  Link,
  IconButton,
  Flex,
  Badge,
  Skeleton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import UIContext from "../providers/UIProvider/context";
import RouteButton from "./RouteButton";
import router from "next/router";
import Web3Context from "../providers/Web3Provider/context";
import ChainSelector from "./ChainSelector";


const Navbar = ({ sitemap, defaultLogo}: {sitemap: any, defaultLogo: string}) => {
    const ui = useContext(UIContext);
    const web3Provider = useContext(Web3Context);
  return (
    <Flex
      boxShadow={["md", "lg"]}
      zIndex={1}
      shadow={"outline"}
      alignItems="center"
      id="Navbar"
      minH="3rem"
      maxH="3rem"
      bgColor="blue.900"
      direction="row"
      w="100%"
      overflow="hidden"
    >
      {ui.isMobileView && (
        <>
          <IconButton
            alignSelf="flex-start"
            aria-label="Menu"
            colorScheme="blue"
            variant="solid"
            onClick={() => ui.setSidebarToggled(!ui.sidebarToggled)}
            icon={<HamburgerIcon />}
          />
        </>
      )}
      <Flex
        pl={ui.isMobileView ? 2 : 8}
        justifySelf="flex-start"
        h="100%"
        py={1}
        w="200px"
        minW="200px"
        // flexGrow={1}
        id="Logo Container"
      >
        <RouterLink href="/" passHref>
          <Link
            as={Image}
            w="fit-content"
            h="auto"
            justifyContent="left"
            src={defaultLogo}
            alt="Logo"
          />
        </RouterLink>
      </Flex>

      {!ui.isMobileView && (
        <Flex pr={14} justifyItems="flex-end" flexGrow={1} alignItems="center">
          <Spacer />
          <ButtonGroup variant="solid" spacing={4} pr={16}>
            {sitemap.map((item: any, idx: number) => {
              return (
                <React.Fragment key={`Fragment-${idx}`}>
                  {!item.children && (
                    <RouteButton
                      key={`${idx}-${item.title}-landing-all-links`}
                      variant="link"
                      href={item.path}
                      color="white"
                      isActive={!!(router.pathname === item.path)}
                    >
                      {item.title}
                    </RouteButton>
                  )}
                  {item.children && (
                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        color="white"
                        variant="link"
                      >
                        {item.title}
                      </MenuButton>
                      <Portal>
                        <MenuList zIndex={100}>
                          {item.children.map((child: any, idx: number) => (
                            <RouterLink
                              shallow={true}
                              key={`${idx}-${item.title}-menu-links`}
                              href={child.path}
                              passHref
                            >
                              <MenuItem key={`menu-${idx}`} as={"a"} m={0}>
                                {child.title}
                              </MenuItem>
                            </RouterLink>
                          ))}
                        </MenuList>
                      </Portal>
                    </Menu>
                  )}
                </React.Fragment>
              );
            })}
          </ButtonGroup>
          {web3Provider.buttonText !== web3Provider.WALLET_STATES.CONNECTED && (
            <Button
              isDisabled={
                web3Provider.WALLET_STATES.UNKNOWN_CHAIN ===
                web3Provider.buttonText
              }
              colorScheme={
                web3Provider.buttonText === web3Provider.WALLET_STATES.CONNECTED
                  ? "green"
                  : web3Provider.WALLET_STATES.UNKNOWN_CHAIN ===
                    web3Provider.buttonText
                  ? "red"
                  : "green"
              }
              onClick={() => web3Provider.onConnectWalletClick()}
            >
              {web3Provider.buttonText}
              {"  "}
              <Image
                pl={2}
                h="24px"
                src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
              />
            </Button>
          )}

          {web3Provider.buttonText === web3Provider.WALLET_STATES.CONNECTED && (
            <Flex>
              <code>
                <Badge
                  colorScheme={"blue"}
                  variant={"subtle"}
                  size="md"
                  fontSize="16px"
                  borderRadius={"md"}
                  mr={2}
                  p={0}
                >
                  <Skeleton
                    isLoaded={!!web3Provider.account}
                    h="100%"
                    colorScheme={"red"}
                    w="100%"
                    borderRadius={"inherit"}
                    startColor="red.500"
                    endColor="blue.500"
                    p={1}
                  >
                    {web3Provider.account}
                  </Skeleton>
                </Badge>
              </code>
            </Flex>
          )}
          <ChainSelector />
        </Flex>
      )}
    </Flex>
  );
};

export default Navbar;
