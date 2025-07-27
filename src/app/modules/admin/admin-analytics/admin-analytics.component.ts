import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { ThemeService } from '../../../../Services/ThemeService';

@Component({
  selector: 'app-admin-analytics',
  standalone: false,
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.scss'
})
export class AdminAnalyticsComponent {
  constructor(public themeService: ThemeService) {}

  public classPieChartOptions: ChartOptions<'pie'> | undefined;
  public admissionLineChartOptions: ChartOptions<'line'> | undefined;
  public feeBarChartOptions: ChartOptions<'bar'> | undefined;

  ngOnInit(): void {
    this.setChartOptions();
  }

  setChartOptions(): void {
    const isDark = this.themeService.getCurrentTheme() === 'dark-theme';
    const textColor = isDark ? '#ffffff' : '#212529';
    const gridColor = isDark ? '#444' : '#ccc';

    this.classPieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };

    this.admissionLineChartOptions = {
      responsive: true,
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };

    this.feeBarChartOptions = {
      responsive: true,
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };
  }

  refreshTheme() {
    this.setChartOptions();
  }

  summaryCards = [
    {
      title: 'Total Students',
      value: '1,542',
      subtitle: '12% Increase',
      changePositive: true,
      changeValue: '12% Increase',
      iconSrc: '../../../../assets/Images/Admin/students1.svg'
    },
    {
      title: 'New Students',
      value: '742',
      subtitle: '09% Increase',
      changePositive: true,
      changeValue: '09% Increase',
      iconSrc: '../../../../assets/Images/Admin/students2.svg'
    },
    {
      title: 'Fees Collection',
      value: '$542',
      subtitle: '49% Total',
      changePositive: true,
      changeValue: '49% Total',
      iconSrc: '../../../../assets/Images/Admin/fees.svg'
    },
    {
      title: 'Fees Pending',
      value: '$785',
      subtitle: '51% Pending',
      changePositive: false,
      changeValue: '-51% Total',
      iconSrc: '../../../../assets/Images/Admin/fees2.svg'
    }
  ];

  activityTableData = [
    { name: 'Anika Roy', class: 'Class 5', status: 'Active', lastUpdated: new Date() },
    { name: 'Samar Singh', class: 'Class 3', status: 'Inactive', lastUpdated: new Date('2025-07-09') },
    { name: 'Isha Reddy', class: 'Class 4', status: 'Pending', lastUpdated: new Date('2025-07-08') },
    { name: 'Vikram Patel', class: 'Class 2', status: 'Active', lastUpdated: new Date('2025-07-10') },
    { name: 'Zoya Khan', class: 'Class 1', status: 'Active', lastUpdated: new Date('2025-07-11') }
  ];

  employeeTableData = [
    { name: 'Meera Sharma', designation: 'Math Teacher', department: 'Academics', status: 'Active', joinedOn: new Date('2022-06-10') },
    { name: 'Ravi Das', designation: 'Accountant', department: 'Finance', status: 'Active', joinedOn: new Date('2021-03-15') },
    { name: 'Nidhi Varma', designation: 'Science Teacher', department: 'Academics', status: 'On Leave', joinedOn: new Date('2023-01-12') },
    { name: 'Arjun Malhotra', designation: 'Clerk', department: 'Administration', status: 'Terminated', joinedOn: new Date('2020-09-01') },
    { name: 'Suhana Ali', designation: 'Computer Lab Assistant', department: 'IT', status: 'Active', joinedOn: new Date('2024-04-18') }
  ];

  showAllEvents = false;

  upcomingEvents = [
    { title: 'Sport Events', description: 'Vivamus pulvinar...', location: '123 6th St. Melbourne, FL', date: '2025-07-23', icon: 'fas fa-running' },
    { title: 'Conference', description: 'Curabitur vel male...', location: '123 6th St. Melbourne, FL', date: '2025-07-16', icon: 'fas fa-chalkboard-teacher' },
    { title: 'Annual Celebration', description: 'School Annual Day', location: 'Auditorium Hall', date: '2025-12-01', icon: 'fas fa-award' }
  ];

  formatDate(date: string | Date) {
    const d = new Date(date);
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    return { month, day };
  }

  get filteredEvents() {
    if (this.showAllEvents) return this.upcomingEvents;

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    return this.upcomingEvents.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.toDateString() === today.toDateString() ||
        eventDate.toDateString() === tomorrow.toDateString()
      );
    });
  }

  public classPieType: 'pie' = 'pie';
  public classPieChartData: ChartData<'pie', number[], string> = {
    labels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    datasets: [
      {
        data: [120, 100, 80, 90, 70],
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff']
      }
    ]
  };

  public admissionLineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [35, 50, 45, 60, 55, 70],
        label: 'New Admissions',
        fill: true,
        tension: 0.4,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.2)'
      }
    ]
  };

  public feeBarChartType: 'bar' = 'bar';
  public feeBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      { data: [10000, 12000, 9000, 14000], label: 'Collected' },
      { data: [2000, 1000, 3000, 2000], label: 'Pending' }
    ]
  };
}
