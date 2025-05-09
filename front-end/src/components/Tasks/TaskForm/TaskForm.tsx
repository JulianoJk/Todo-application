import { Button, Container, Input, Group } from "@mantine/core";
import { useState } from "react";
import { CirclePlus } from "tabler-icons-react";
import { submitTasks } from "../../../API/Api";
import { useTaskDispatch } from "../../../context/TaskContext";
import { useUserState } from "../../../context/UserContext";
import { ITasks } from "../../../Model/models";
import DisplayTasks from "../DisplayTasks/DisplayTasks";
import styles from "./TaskForm.module.css";

const TaskForm: React.FC = () => {
  const { user } = useUserState();
  const dispatch = useTaskDispatch();

  const [name, setname] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const response = await submitTasks(user, name);
    if (typeof response === "string" || !response) return;

    dispatch({
      type: "ADD_TASK",
      payload: {
        name: response.name,
        taskID: response._id,
        completed: response.completed,
      },
    });

    setname("");
  };

  return (
    <Container size="md" className={styles.border}>
      <form onSubmit={handleSubmit}>
        <Group grow mb="md">
          <Input
            variant="filled"
            radius="md"
            size="lg"
            value={name}
            onChange={(e: any) => setname(e.currentTarget.value)}
            placeholder="Add tasks"
            autoComplete="on"
          />
          <Button
            type="submit"
            color="green"
            radius="md"
            size="md"
            rightIcon={<CirclePlus size={20} />}
          >
            Add task
          </Button>
        </Group>
      </form>

      <DisplayTasks />
    </Container>
  );
};

export default TaskForm;
