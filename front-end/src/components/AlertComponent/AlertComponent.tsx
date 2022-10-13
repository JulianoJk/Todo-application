import React from "react";
import { Alert, Center, Text, Title } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

interface IProps {
  className: string | undefined;
  message: string | null | undefined;
}
export const AlertComponent: React.FC<IProps> = ({ className, message }) => {
  return (
    <Center>
      <Alert
        icon={<AlertCircle strokeWidth={3} />}
        title={<Title order={4}>Error!</Title>}
        color="red"
        radius="lg"
        className={className}
      >
        <Text weight={700} size="lg">
          {message}
        </Text>
      </Alert>
    </Center>
  );
};
