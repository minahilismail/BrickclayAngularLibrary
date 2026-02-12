/*
 * Public API Surface of brickclay-lib
 */

//Icons
export * from './lib/assets/icons'
//Library
export * from './lib/brickclay-lib';
//Calender
export * from './lib/calender/components/custom-calendar/custom-calendar.component';
export * from './lib/calender/components/scheduled-date-picker/scheduled-date-picker.component';
export * from './lib/calender/components/time-picker/time-picker.component';
export * from './lib/calender/calendar.module';
export * from './lib/calender/services/calendar-manager.service';
//Toggle
export * from './lib/toggle/toggle';
//CheckBox
export * from './lib/checkbox/checkbox';
//Radio-Button
export * from './lib/radio/radio'


// 🆕 Dialog system
export { BkDialogModule } from './lib/dialog/dialog.module';
export { DialogService } from './lib/dialog/dialog.service';
export { DialogRef } from './lib/dialog/dialog-ref';
export { DIALOG_DATA, DIALOG_GLOBAL_CONFIG } from './lib/dialog/dialog.tokens';
export type { DialogConfig, DialogPosition, DialogAnimation } from './lib/dialog/dialog-config';
export { DEFAULT_DIALOG_CONFIG } from './lib/dialog/dialog-config';
export {
  BkDialogTitle,
  BkDialogContent,
  BkDialogActions,
  BkDialogClose,
} from './lib/dialog/dialog-content-directives';
export type { AnimationKeyframes } from './lib/dialog/dialog-animations';
export { getDialogPanelAnimation, getDialogBackdropAnimation } from './lib/dialog/dialog-animations';