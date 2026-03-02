import { mockPlots as initialMockPlots } from '../data/mockData';

const initializePlots = () => {
  const storedPlots = localStorage.getItem('terraVillaPlots');
  if (storedPlots) {
    return JSON.parse(storedPlots);
  }
  localStorage.setItem('terraVillaPlots', JSON.stringify(initialMockPlots));
  return initialMockPlots;
};

let currentPlots = initializePlots();

const savePlots = () => {
  localStorage.setItem('terraVillaPlots', JSON.stringify(currentPlots));
};

export const addNewPlot = (plotData) => {
  const newPlot = {
    ...plotData,
    id: 'plot-' + Date.now(),
    status: 'pending_verification',
    verification_status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  currentPlots.unshift(newPlot);
  savePlots();
  return newPlot;
};

export const updatePlotStatus = (plotId, newStatus) => {
  const plotIndex = currentPlots.findIndex((plot) => plot.id === plotId);

  if (plotIndex === -1) {
    return null;
  }

  currentPlots[plotIndex] = {
    ...currentPlots[plotIndex],
    status: newStatus,
    updated_at: new Date().toISOString()
  };

  savePlots();
  return currentPlots[plotIndex];
};

export const setVerificationStatus = (plotId, newVerificationStatus) => {
  const plotIndex = currentPlots.findIndex((plot) => plot.id === plotId);
  if (plotIndex === -1) return null;

  currentPlots[plotIndex] = {
    ...currentPlots[plotIndex],
    verification_status: newVerificationStatus,
    updated_at: new Date().toISOString(),
  };

  savePlots();
  return currentPlots[plotIndex];
};

export const getPlotById = (plotId) => {
  return currentPlots.find((plot) => plot.id === plotId);
};

export const getAllPlots = () => {
  return currentPlots;
};

export const deletePlot = (plotId) => {
  const prevLength = currentPlots.length;
  currentPlots = currentPlots.filter((p) => p.id !== plotId);
  const changed = currentPlots.length !== prevLength;
  if (changed) savePlots();
  return changed;
};

export const updatePlot = (plotId, updates) => {
  const idx = currentPlots.findIndex((p) => p.id === plotId);
  if (idx === -1) return null;

  currentPlots[idx] = {
    ...currentPlots[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  savePlots();
  return currentPlots[idx];
};
