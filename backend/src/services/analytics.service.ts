export class AnalyticsService {
  async usage() {
    return {
      utilizationRate: 0,
      totalBookings: 0,
      peakHours: []
    };
  }
}
