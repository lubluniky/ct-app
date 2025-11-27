# Share Feature Implementation Summary

## Overview
Replaced the legacy `SnapshotButton` with the new `ShareChartDialog` across the application to standardize the sharing experience. The new dialog provides a branded "Centurion Terminal" card with user details, tier status, and chart metadata.

## Changes

### Components Updated
1.  **Rolling VWAP Panel** (`src/components/rvwap/RvwapPanel.tsx`)
    *   Replaced `SnapshotButton` with `ShareChartDialog`.
    *   Configured with title "Rolling VWAP Analysis" and indicator "RVWAP".

2.  **VPIN Panel** (`src/components/vpin/VPINPanel.tsx`)
    *   Replaced `SnapshotButton` with `ShareChartDialog`.
    *   Configured with title "VPIN Analysis" and indicator "VPIN".

3.  **Market Tension Map Dashboard** (`src/pages/MtmDashboard.tsx`)
    *   Replaced `SnapshotButton` with `ShareChartDialog` in the `Panel` component.
    *   Configured with title "Market Tension Map" and indicator "MTM".

### Features
*   **Branded Card**: All shares now generate a consistent, high-quality card image.
*   **User Info**: Includes user name and tier (PRO/ULTRA).
*   **Metadata**: Automatically includes Symbol, Timeframe, and Indicator type.
*   **Compact Footer**: Uses the optimized compact footer layout.

## Verification
*   Check `RvwapPanel` to ensure the "Share" button opens the dialog.
*   Check `VPINPanel` to ensure the "Share" button opens the dialog.
*   Check `MtmDashboard` panels to ensure the "Share" button opens the dialog.
*   Verify the generated image includes the correct chart content and footer details.
