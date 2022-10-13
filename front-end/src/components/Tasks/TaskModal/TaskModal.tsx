import {
  Button,
  Input,
  Modal,
  useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import { editTasks } from "../../../API/Api";
import { useTaskDispatch } from "../../../context/TaskContext";
import { useUserState } from "../../../context/UserContext";
import { ITasks } from "../../../Model/models";
import style from "./TaskModal.module.css";

interface Props {
  editedTodo: ITasks | undefined;
  modalOpen: boolean;
  setModalOpen: (val: React.SetStateAction<boolean>) => void;
}
const TaskModal: React.FC<Props> = ({
  editedTodo,
  setModalOpen,
  modalOpen,
}) => {
  const { user } = useUserState();

  const [input, setInput] = useState<string>("");

  const theme = useMantineTheme();

  const editTaskDispatch = useTaskDispatch();

  const handleChange = (e: React.BaseSyntheticEvent): void => {
    setInput(e.target.value);
  };

  const fetchEdit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    if (editedTodo?.taskID !== undefined && input.trim() !== "") {
      // pass user, taskID and the opposite of the
      const apiResponse = await editTasks(user, editedTodo?.taskID, input);
      if (typeof apiResponse === "string" || apiResponse instanceof String) {
        return;
      } else if (apiResponse) {
        editTaskDispatch({
          type: "EDIT_TASK",
          payload: { taskID: editedTodo.taskID, taskName: input },
        });
      }
    }

    setInput("");
    setModalOpen(false);
  };

  return (
    <Modal
      opened={modalOpen}
      withCloseButton={true}
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      onClose={() => setModalOpen(false)}
    >
      <div className={` ${style.modal_background}`}>
        <form onSubmit={fetchEdit}>
          <Input
            type="text"
            name="editTask"
            value={input}
            placeholder={editedTodo?.taskName}
            onChange={handleChange}
            autoComplete="on"
          />

          <Button color={"red"} onClick={() => setModalOpen(false)}>
            Close
          </Button>
          <Button color={"lime"} onClick={fetchEdit}>
            Save changes
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default TaskModal;
