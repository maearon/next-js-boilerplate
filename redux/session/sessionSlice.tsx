import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import API from '../../components/shared/api'
import { RootState } from '../store';

export interface User {
  readonly id: number
  email: string
  name: string
  role: boolean
  avatar?: string
}

export interface UserState {
  loggedIn: boolean
  value: User
  status: 'idle' | 'loading' | 'failed'
  error: string
}

const initialState: UserState = {
  loggedIn: false,
  value: {} as User,
  status: 'idle',
  error: ''
};

export const fetchUser = createAsyncThunk('session/getCurrentUser', async () => {
  const response = await API.get('/sessions')
  return response;
});

// export const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   extraReducers: {
//     [fetchUsers.pending]: (state) => {
//       state.loading = true;
//     },
//     [fetchUsers.fulfilled]: (state, action) => {
//       state.loading = false;
//       state.users = action.payload.user;
//       state.error = '';
//     },
//     [fetchUsers.rejected]: (state, action) => {
//       state.loading = false;
//       state.users = [];
//       state.error = action.payload;
//     },
//   }
// })

// export const selectCurrentUser = (state) => state.user.users

// export default userSlice.reducer;

export const sessionSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },

    // incrementSaga: (state, action: PayloadAction<number>) => {
    //   state.status = 'loading';
    // },
    // incrementSagaSuccess: (state, action: PayloadAction<number>) => {
    //   state.status = 'idle';
    //   state.value += action.payload;
    // },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUser.fulfilled, (state, action: any) => {
        state.status = 'idle'
        state.loggedIn = true
        state.value = action.payload.user
        state.error = ''
      })
      .addCase(fetchUser.rejected, (state, action: any) => {
        state.status = 'idle'
        state.loggedIn = false
        state.value = {} as User
        state.error = action.payload
      });
  },
});

// export const { increment, decrement, incrementByAmount, incrementSaga, incrementSagaSuccess } =
// userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state: RootState) => state.session;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default sessionSlice.reducer;