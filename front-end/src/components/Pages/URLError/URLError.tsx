import React, { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router";
import styles from "./URLError.module.css";
import stop_sign from "../../../images/stop_sign.png";
import {
  Button,
  Group,
  Image,
  Modal,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
interface IPops {
  bodyText?: string;
  navText?: string;
  statusNumber?: number;
  btnText?: string;
  navigationPath?: string;
}

// In case the user tries to navigate to a non-existing URL or navigates to "Home"/"Profile" without being logged, display error modal
const URLError: React.FC<IPops> = ({
  bodyText: text,
  navText,
  btnText,
  navigationPath,
}) => {
  const navigate: NavigateFunction = useNavigate();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(true);

  return (
    <div>
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        withCloseButton={false}
        onClose={() => setOpened(true)}
        title={
          <Title order={1} className={`${styles.nav_bg}`}>
            {navText}
          </Title>
        }
        size="xl"
        radius={30}
      >
        <Image radius="md" src={stop_sign} alt="stop_sign" />
        <Text align="center">{text}</Text>
        <Group position="center">
          <Button
            variant="gradient"
            gradient={{ from: "teal", to: "lime", deg: 105 }}
            radius="md"
            size="lg"
            fullWidth
            onClick={() => navigate(`${navigationPath}`)}
          >
            {btnText}
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default URLError;
