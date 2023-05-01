import { SetStateAction, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TaskCard from "@/comps/Card";
import apiService from "./api/api";
import { AxiosResponse } from "axios";
import styled from "@emotion/styled";

interface Todo {
  id: string;
  title: string;
  completion?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const Container = styled.div({
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
});

const TopWrapper = styled.div({
  width: "100%",
  height: "20vh",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  "@media (max-width: 768px)": {
    height: "40vh",
    flexDirection: "column",
  },
});

const ButtomWrapper = styled.div({
  width: "25%",
  height: "50vh",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const ButtomLeftWrapper = styled.div({
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
});

const ButtomRightWrapper = styled.div({
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  marging: 10,
});

const DeleteButtonWrapper = styled.div({
  width: "10%",
  height: "10%",
  alignItems: "center ",
  justifyItems: "center",
});

export default function Home() {
  const [todoTasks, setTodoTasks] = useState<Todo[]>([]);
  const [doneTasks, setDoneTasks] = useState<Todo[]>([]);
  const [searchText, setSearchText] = useState("");
  const [deleteConf, setdeleteConf] = useState<Boolean>(false);
  const [searchResults, setSearchResults] = useState([]);

  const [task, setTask] = useState("");

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTask(event.target.value);
  };

  const handleDelete = () => {
    setdeleteConf(true);
  };

  const handleCancel = () => {
    setdeleteConf(false);
  };

  const handleConfirm = async () => {
    const response = await apiService.deleteAllTask("");
    setdeleteConf(false);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const newTask = { title: task };
    const response = await apiService.addTask(newTask);
    const addedTask: Todo = response?.data.data[0];
    setTodoTasks([...todoTasks, addedTask]);
    setTask("");
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    const newText = { searchText: searchText };
    setSearchText(searchText);
    const response = await apiService.searchTask(newText);
    const arrangedData = response?.data.data;
    setSearchResults(arrangedData);

    if (arrangedData.length > 0) {
      const cardElements = document.querySelectorAll(
        '[id*="card"]'
      ) as NodeListOf<HTMLElement>;
      cardElements.forEach((card) => {
        card.style.display = "none";
      });
      const searchedIds = arrangedData.map((task: any) => "card" + task.id);
      console.log(searchedIds);
      for (let i = 0; i < searchedIds.length; i++) {
        const test = document.getElementById(searchedIds[i]);
        if (test !== null) {
          if (!!searchText.length) {
            if (arrangedData[i].title.includes(searchText)) {
              test.style.border = "1px solid green";
              test.style.display = "block";
            } else {
              test.style.border = "0px solid green";
              test.style.display = "none";
            }
          } else {
            test.style.border = "0px solid green";
            test.style.display = "block";
          }
        }
      }
    }
  };

  const handleToggle = async (
    id: string,
    title: string,
    completion: boolean | undefined
  ) => {
    const response: AxiosResponse = await apiService.updateTask({
      id,
      title,
      completion: !completion,
    });
    const updatedTask = response?.data.data[0];
    updatedTask.completion = !completion;
    if (completion) {
      const newDoneTasks = doneTasks.filter(
        (task) => task.id !== id.toString()
      );
      setDoneTasks(newDoneTasks);
      const newTodoTasks = [...todoTasks, updatedTask];
      setTodoTasks(newTodoTasks);
      await apiService.updateTask({
        id: updatedTask.id,
        completion: !updatedTask.completion,
      });
    } else {
      const newTodoTasks = todoTasks.filter(
        (task) => task.id !== id.toString()
      );
      setTodoTasks(newTodoTasks);
      const newDoneTasks = [...doneTasks, updatedTask];
      setDoneTasks(newDoneTasks.slice(0,10));
      await apiService.updateTask({
        id: updatedTask.id,
        completion: !updatedTask.completion,
      });
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const response: AxiosResponse = await apiService.getAllTasks("");
      const dataArray = response?.data.data || [];


      const newTodoTasks = dataArray.filter(
        (todo: any) => todo.completion === false
      );
    
      const newestDoneTasks = dataArray
      .filter((todo: any) => todo.completion === true)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
      
      setTodoTasks(newTodoTasks);
      setDoneTasks(newestDoneTasks);
    };
    fetchTasks();
  }, []);

  if (todoTasks === null) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Container>
          <TopWrapper>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                id="filled-search"
                label="Add your Task"
                variant="filled"
                onChange={handleChange}
                value={task}
              />

              <Button type="submit" variant="contained" sx={{ m: 1.5 }}>
                Add Task
              </Button>
            </Box>

            <TextField
              label="Search tasks"
              variant="outlined"
              value={searchText}
              onChange={handleSearch}
            />
            {!deleteConf ? (
                <Button onClick={handleDelete}>Delete All</Button>
            ) : (
              <>
                  <h3>Are you sure</h3>
                  <Button onClick={handleConfirm}>OK</Button>
                  <Button onClick={handleCancel}>Cancel</Button>
              </>
            )}
          </TopWrapper>

          <ButtomWrapper>
            <ButtomLeftWrapper>
              <Box
                sx={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h2>Todo</h2>
                {todoTasks.length > 0 ? (
                  todoTasks.map((task) => (
                    <TaskCard
                      key={task.id + "todo"}
                      id={"card" + task.id}
                      title={task.title}
                      completion={task.completion}
                      onToggle={() =>
                        handleToggle(task.id, task.title, task.completion)
                      }
                      className={"todo" + task.id}
                    />
                  ))
                ) : (
                  <div>No tasks</div>
                )}
              </Box>
            </ButtomLeftWrapper>
            <ButtomRightWrapper>
              <Box sx={{ maxWidth: 800, maxHeight: 800 }}>
                <h2>Done</h2>
                {doneTasks.length > 0 ? (
                  doneTasks.map((task) => (
                    <TaskCard
                      key={task.id + "done"}
                      id={"card" + task.id}
                      title={task.title}
                      completion={task.completion}
                      onToggle={() =>
                        handleToggle(task.id, task.title, task.completion)
                      }
                    />
                  ))
                ) : (
                  <div>No done tasks</div>
                )}
              </Box>
            </ButtomRightWrapper>
          </ButtomWrapper>
        </Container>
      </>
    );
  }
}
