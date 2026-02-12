import { Plot, PlotStatus } from '../types';
import { mockPlots as initialMockPlots } from '../data/mockData';

// Initialize plots from localStorage or use initial mock data
const initializePlots = (): Plot[] => {
  const storedPlots = localStorage.getItem('terraVillaPlots');
  if (storedPlots) {
    return JSON.parse(storedPlots);
  }
  localStorage.setItem('terraVillaPlots', JSON.stringify(initialMockPlots));
  return initialMockPlots;
};

// Get the current plots
let currentPlots = initializePlots();

// Function to save plots to localStorage
const savePlots = () => {
  localStorage.setItem('terraVillaPlots', JSON.stringify(currentPlots));
};

// Function to add a new plot to mock data
export const addNewPlot = (plotData: Omit<Plot, 'id' | 'created_at' | 'updated_at' | 'status' | 'verification_status'>): Plot => {
  const newPlot: Plot = {
    ...plotData,
    id: 'plot-' + Date.now(),
    status: 'pending_verification',
    verification_status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  currentPlots.unshift(newPlot); // Add to the beginning of the array
  savePlots(); // Save to localStorage
  return newPlot;
};

// Function to update the status of a plot
export const updatePlotStatus = (plotId: string, newStatus: PlotStatus): Plot | null => {
  const plotIndex = currentPlots.findIndex((plot: Plot) => plot.id === plotId);
  
  if (plotIndex === -1) {
    return null;
  }

  currentPlots[plotIndex] = {
    ...currentPlots[plotIndex],
    status: newStatus,
    updated_at: new Date().toISOString()
  };

  savePlots(); // Save to localStorage
  return currentPlots[plotIndex];
};

// Function to set verification status for a plot
export const setVerificationStatus = (plotId: string, newVerificationStatus: any): Plot | null => {
  const plotIndex = currentPlots.findIndex((plot: Plot) => plot.id === plotId);
  if (plotIndex === -1) return null;

  currentPlots[plotIndex] = {
    ...currentPlots[plotIndex],
    verification_status: newVerificationStatus,
    updated_at: new Date().toISOString(),
  } as Plot;

  savePlots();
  return currentPlots[plotIndex];
};

// Function to get a plot by ID
export const getPlotById = (plotId: string): Plot | undefined => {
  return currentPlots.find((plot: Plot) => plot.id === plotId);
};

// Function to get all plots (for components that need the data)
export const getAllPlots = (): Plot[] => {
  return currentPlots;
};

// Function to delete a plot by ID
export const deletePlot = (plotId: string): boolean => {
  const prevLength = currentPlots.length;
  currentPlots = currentPlots.filter((p) => p.id !== plotId);
  const changed = currentPlots.length !== prevLength;
  if (changed) savePlots();
  return changed;
};

// Function to update a plot by ID with partial data
export const updatePlot = (plotId: string, updates: Partial<Omit<Plot, 'id' | 'created_at' | 'updated_at' | 'status' | 'verification_status'>>): Plot | null => {
  const idx = currentPlots.findIndex((p) => p.id === plotId);
  if (idx === -1) return null;

  currentPlots[idx] = {
    ...currentPlots[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  } as Plot;

  savePlots();
  return currentPlots[idx];
};