/**
 * Screen router. One phase visible at a time; the 'playing' phase stacks the
 * React HUD, build sheet, and end screen above the Pixi canvas.
 *
 * #app-frame (styled in styles/app.css) is the device frame: a centered
 * portrait column that fills phones edge-to-edge and letterboxes on desktop.
 * Everything — canvas and DOM UI — lives inside it, so they always align.
 */
import { useStore } from '../state/store.ts';
import LoadingScreen from './LoadingScreen.tsx';
import MainMenu from './MainMenu.tsx';
import Hud from './Hud.tsx';
import StationRail from './StationRail.tsx';
import EndScreen from './EndScreen.tsx';
import MetaUpgrades from './MetaUpgrades.tsx';
import Leaderboard from './Leaderboard.tsx';
import Settings from './Settings.tsx';
import DailyRewards from './DailyRewards.tsx';
import GameCanvas from '../game/GameCanvas.tsx';
import NameDialog from './NameDialog.tsx';
import RenameDialog from './RenameDialog.tsx';
import { store } from '../state/store.ts';

export default function App() {
    const phase = useStore((s) => s.phase);
    const runId = useStore((s) => s.runId);
    const metaOpen = useStore((s) => s.metaOpen);
    const ranksOpen = useStore((s) => s.ranksOpen);
    const settingsOpen = useStore((s) => s.settingsOpen);
    const dailyRewardsOpen = useStore((s) => s.dailyRewardsOpen);
    const bootNameDialogOpen = useStore((s) => s.bootNameDialogOpen);
    const bootAskLanguage = useStore((s) => s.bootAskLanguage);
    const renameOpen = useStore((s) => s.renameOpen);
    // Round 20 (docs/Ideas.md §10.2 pick A): subscribing here — the render
    // root, nothing below uses React.memo — is what makes a language switch
    // instant everywhere. t()/tn() already read the live table on every
    // call; without SOME subscribed field changing, nothing tells React to
    // run those calls again. The value itself is unused, only the
    // subscription (and the resulting whole-tree re-render) matters.
    useStore((s) => s.locale);
    return (
        <div id="app-frame" className="bg-surface text-white">
            {phase === 'loading' && <LoadingScreen />}
            {phase === 'menu' && <MainMenu />}
            {phase === 'playing' && (
                <div className="absolute inset-0">
                    {/* keyed on runId: each run is a fresh engine + scene */}
                    <GameCanvas key={runId} />
                    <Hud />
                    <StationRail />
                    <EndScreen />
                </div>
            )}
            {/* overlays, not phases, so nothing unmounts underneath */}
            {metaOpen && <MetaUpgrades />}
            {ranksOpen && <Leaderboard />}
            {settingsOpen && <Settings />}
            {dailyRewardsOpen && <DailyRewards />}
            {/* Round 10 Part 3: the guest name dialog now opens at the START
                of the scripted run (main.tsx step 6 sets both this flag and
                paused:true in the same patch) rather than being gated on
                MainMenu's Start shift tap — mounted here, not inside the
                'playing' block, so it renders regardless of which phase the
                flag happened to be set during. onDone only clears the flag
                and unpauses; the opening dialogue beat was already armed in
                the SAME boot patch that set this flag (actions.ts's
                scriptedRunStart), so it's simply the next thing the
                (now-unpaused) run reveals. */}
            {bootNameDialogOpen && (
                <NameDialog
                    askLanguage={bootAskLanguage}
                    onDone={() => store.patch({ bootNameDialogOpen: false, bootAskLanguage: false, paused: false })}
                />
            )}
            {/* Round 10 Part 6: opened from the menu's greeting bubble or
                Settings' Name row (guests only) — an overlay, same posture
                as Settings/MetaUpgrades/Leaderboard above. */}
            {renameOpen && <RenameDialog />}
        </div>
    );
}
