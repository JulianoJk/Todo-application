import Logo from "../../../images/logo.png";
import styles from "./Index.module.css";
import { Stack, Image, Center } from "@mantine/core";

const Index: React.FC = () => {
  return (
    <Center>
      <Stack>
        <Image radius="md" fit="contain" alt="Logo" src={Logo} />
        <div className={`d-flex justify-content-center ${styles.quotes}`}>
          <h2 className="lead">
            <em>
              <strong>Stay Organized</strong>
              <br />
              <strong>Stay Creative</strong>
            </em>
          </h2>
        </div>
      </Stack>
    </Center>
  );
};

export default Index;
