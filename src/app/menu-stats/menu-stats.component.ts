import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MessmenuService } from '../messmenu.service';

declare let Plotly: any;

@Component({
  selector: 'app-menu-stats',
  templateUrl: './menu-stats.component.html',
  styleUrls: ['./menu-stats.component.css']
})
export class MenuStatsComponent implements OnInit, OnDestroy {
  app_bar_suffix = 'Menu Stats';

  overview: any = null;
  overviewLoading = true;
  overviewError = false;

  byHostel: any[] = [];
  byHostelLoading = true;
  byHostelError = false;

  timelineGranularity = 'week';
  timelineHostel = '';
  timelineLoading = true;
  timelineError = false;
  timelineEmpty = false;

  inactiveDays = 14;
  inactiveHostels: any[] = [];
  inactiveLoading = true;
  inactiveError = false;

  failures: any = null;
  failuresLoading = true;
  failuresError = false;

  private pollingInterval: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private messmenuService: MessmenuService
  ) {
    if (!this.auth.isLoggedIn() || !this.auth.isAdmin()) {
      this.router.navigate(['login']);
    }
  }

  ngOnInit(): void {
    this.loadAll();
    this.pollingInterval = setInterval(() => {
      this.loadOverview();
      this.loadInactiveHostels();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  loadAll(): void {
    this.loadOverview();
    this.loadByHostel();
    this.loadTimeline();
    this.loadInactiveHostels();
    this.loadFailures();
  }

  loadOverview(): void {
    this.overviewLoading = true;
    this.messmenuService.getMenuStatsOverview().then((res: any) => {
      this.overview = res;
      this.overviewLoading = false;
      this.overviewError = false;
      setTimeout(() => this.renderStatusDonut(), 50);
    }).catch(() => {
      this.overviewLoading = false;
      this.overviewError = true;
    });
  }

  loadByHostel(): void {
    this.byHostelLoading = true;
    this.messmenuService.getMenuStatsByHostel().then((res: any) => {
      this.byHostel = res.by_hostel || [];
      this.byHostelLoading = false;
      this.byHostelError = false;
    }).catch(() => {
      this.byHostelLoading = false;
      this.byHostelError = true;
    });
  }

  loadTimeline(): void {
    this.timelineLoading = true;
    this.timelineEmpty = false;
    const hostel = this.timelineHostel || undefined;
    this.messmenuService.getMenuStatsTimeline(this.timelineGranularity, hostel).then((res: any) => {
      this.timelineLoading = false;
      this.timelineError = false;
      const tl = res.timeline || [];
      this.timelineEmpty = tl.length === 0;
      setTimeout(() => this.renderTimelineChart(tl), 50);
    }).catch(() => {
      this.timelineLoading = false;
      this.timelineError = true;
    });
  }

  loadInactiveHostels(): void {
    this.inactiveLoading = true;
    this.messmenuService.getInactiveHostels(this.inactiveDays).then((res: any) => {
      // Sort by hostel name: H-numbered hostels numerically (H1, H2, H3…),
      // then any hostels that don't match the format (e.g. "TANSA") last.
      this.inactiveHostels = (res.inactive_hostels || []).sort((a: any, b: any) => {
        const rank = (hostel: string): number => {
          const m = /^H(\d+)$/i.exec(hostel || '');
          return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
        };
        return rank(a.hostel) - rank(b.hostel);
      });
      this.inactiveLoading = false;
      this.inactiveError = false;
    }).catch(() => {
      this.inactiveLoading = false;
      this.inactiveError = true;
    });
  }

  loadFailures(): void {
    this.failuresLoading = true;
    this.messmenuService.getMenuStatsFailures().then((res: any) => {
      this.failures = res;
      this.failuresLoading = false;
      this.failuresError = false;
      setTimeout(() => this.renderFailuresChart(res.by_hostel || []), 50);
    }).catch(() => {
      this.failuresLoading = false;
      this.failuresError = true;
    });
  }

  onGranularityChange(g: string): void {
    this.timelineGranularity = g;
    this.loadTimeline();
  }

  onInactiveDaysChange(days: number): void {
    this.inactiveDays = days;
    this.loadInactiveHostels();
  }

  failureRate(): string {
    if (!this.failures || !this.failures.total_attempts) return '0.0%';
    return ((this.failures.total_failed / this.failures.total_attempts) * 100).toFixed(1) + '%';
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Never';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  private plotlyLayout(extraHeight?: number): any {
    return {
      paper_bgcolor: '#FFFCF4',
      plot_bgcolor: '#FFFCF4',
      font: { family: 'Roboto, sans-serif', size: 12 },
      margin: { t: 16, b: 50, l: 50, r: 16 },
      autosize: true,
      height: extraHeight ?? 260,
    };
  }

  private plotlyConfig(): any {
    return { responsive: true, displayModeBar: false };
  }

  renderStatusDonut(): void {
    if (!this.overview) return;
    const el = document.getElementById('status-donut');
    if (!el) return;
    const { pending_approval, approved, rejected } = this.overview.by_status;
    Plotly.react('status-donut', [{
      type: 'pie',
      hole: 0.55,
      values: [pending_approval, approved, rejected],
      labels: ['Pending', 'Approved', 'Rejected'],
      marker: { colors: ['#FFC42B', '#4CAF50', '#f44336'] },
      textinfo: 'label+value',
      hoverinfo: 'label+percent',
    }], {
      paper_bgcolor: '#FFFCF4',
      plot_bgcolor: '#FFFCF4',
      margin: { t: 10, b: 50, l: 10, r: 10 },
      showlegend: true,
      legend: { orientation: 'h', y: -0.18, x: 0.5, xanchor: 'center' },
      autosize: true,
      height: 280,
      font: { family: 'Roboto, sans-serif', size: 12 },
    }, this.plotlyConfig());
  }

  renderTimelineChart(timeline: any[]): void {
    const el = document.getElementById('timeline-chart');
    if (!el || !timeline.length) return;
    Plotly.react('timeline-chart', [{
      type: 'bar',
      x: timeline.map((t: any) => t.period),
      y: timeline.map((t: any) => t.count),
      marker: { color: '#FFC42B', line: { color: '#28282B', width: 0.5 } },
      name: 'Uploads',
    }], {
      ...this.plotlyLayout(),
      xaxis: { tickangle: -40, automargin: true },
      yaxis: { title: { text: 'Uploads' }, dtick: 1 },
    }, this.plotlyConfig());
  }

  renderFailuresChart(byHostel: any[]): void {
    const el = document.getElementById('failures-chart');
    if (!el || !byHostel.length) return;
    Plotly.react('failures-chart', [{
      type: 'bar',
      orientation: 'h',
      x: byHostel.map(h => h.failed_attempts),
      y: byHostel.map(h => h.hostel ?? 'Unknown'),
      marker: { color: '#f44336' },
      text: byHostel.map(h => String(h.failed_attempts)),
      textposition: 'outside',
      cliponaxis: false,
    }], {
      paper_bgcolor: '#FFFCF4',
      plot_bgcolor: '#FFFCF4',
      margin: { t: 16, b: 40, l: 70, r: 50 },
      autosize: true,
      height: Math.max(200, byHostel.length * 28),
      xaxis: { title: { text: 'Failed Attempts' } },
      font: { family: 'Roboto, sans-serif', size: 12 },
    }, this.plotlyConfig());
  }
}
