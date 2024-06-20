import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PartnerState {
  username: string;
  online: boolean;
}

export const partnerInitState: PartnerState = {
  username: '',
  online: false,
};

export const partnerSlice = createSlice({
  name: 'partner',
  initialState: partnerInitState,
  reducers: {
    setPartnerUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setOnlinePartner: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPartnerUsername, setOnlinePartner } = partnerSlice.actions;

export default partnerSlice.reducer;
