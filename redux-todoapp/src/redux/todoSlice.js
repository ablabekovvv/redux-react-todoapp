import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTodosAsync = createAsyncThunk('todos/getTodosAsync', async() => {
    const response = await fetch("https://60f1235338ecdf0017b0fa5e.mockapi.io/todo")
    if(response.ok) {
        const todos = await response.json();
        return { todos }
    }
})

export const addTodoAsync = createAsyncThunk("todos/addTodoAsync", async (payload) => {
    const response = await fetch("https://60f1235338ecdf0017b0fa5e.mockapi.io/todo", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({title: payload.title})
    })

    if(response.ok){
        const todo = await response.json();
        return { todo };
    }
})

export const toggleCompleteAsync = createAsyncThunk(
    'todos/completeTodoAsync',
    async (payload) => {
        const resp = await fetch(`https://60f1235338ecdf0017b0fa5e.mockapi.io/todo/${payload.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: payload.completed }),
        });

        if (resp.ok) {
            const todo = await resp.json();
            return { todo };
        }
    }
);

export const deleteTodoAsync = createAsyncThunk("todos/deleteTodoAsync", async (payload) => {
    const response = await fetch(
        `https://60f1235338ecdf0017b0fa5e.mockapi.io/todo/${payload.id}`, {
            method: "DELETE",
        }
    );
    if (response.ok) {
        return {id: payload.id}
    }
})

const todoSlice = createSlice({
    name: "todos",
    initialState: [
        {id: 1, title: "todo1", completed: false},
        {id: 2, title: "todo2", completed: false},
        {id: 3, title: "todo3", completed: true},
    ],
    reducers: {
        addTodo: (state, action) => {
            const newTodo = {
                id: Date.now(),
                title: action.payload.title,
                completed: false,
            };
            state.push(newTodo)
        },
        toogleComplete: (state, action) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id);
            state[index].completed = action.payload.completed;
        },
        deleteTodo: (state, action) => {
            return state.filter((todo) => todo.id !== action.payload.id )
        }
    },
    extraReducers: {
        [getTodosAsync.pending]: (state, action) => {
            console.log("f")
        },
        [getTodosAsync.fulfilled]: (state, action) => {
            console.log("yes")
            return action.payload.todos
        },
        [addTodoAsync.fulfilled]: (state, action) => {
            state.push(action.payload.todo)
        },
        [toggleCompleteAsync.fulfilled]: (state, action) => {
            const index = state.findIndex(
                (todo) => todo.id === action.payload.todo.id
            );
            state[index].completed = action.payload.todo.completed;
        },
        [deleteTodoAsync.fulfilled]: (state, action) => {
            return state.filter((todo) => todo.id !== action.payload.id);
        },
    }
});

export const {addTodo, toogleComplete, deleteTodo} = todoSlice.actions;

export default todoSlice.reducer;
