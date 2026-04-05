import { Component, OnInit, OnDestroy } from '@angular/core';
import { School, SchoolService } from '../../services/school.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppLanguage, LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: false
})
export class MapPage implements OnInit, OnDestroy {
  map!: L.Map;
  schools: School[] = [];
  markerLayer = L.layerGroup(); 
  
  language: AppLanguage = 'en';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private schoolService: SchoolService,
    private languageService: LanguageService,
    private router: Router
  ) { }

  ngOnInit() {

    this.language = this.languageService.currentLanguage;
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => {
        this.language = language;

        this.addMarkersToMap();
      });


      this.schoolService.getSchools().subscribe(data => {
      this.schools = data;
      this.addMarkersToMap();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewDidEnter() {
    if (!this.map) {
      this.initMap();
    } else {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 200);
    }
  }


  
  getPageTitle(): string {
    return this.language === 'zh' ? '學校地圖' : 'School Map';
  }

  getBadgeText(): string {
    return this.language === 'zh' ? '正在顯示附近學校' : 'Showing nearby schools';
  }

  private initMap(): void {
    const hongKongBounds = L.latLngBounds(
      L.latLng(22.153, 113.825), 
      L.latLng(22.562, 114.406)  
    );

    this.map = L.map('mapId', {
      center: [22.3193, 114.1694],
      zoom: 12,                    
      minZoom: 11,                 
      maxZoom: 18,               
      maxBounds: hongKongBounds,   
      maxBoundsViscosity: 1.0,     
      zoomControl: false           
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);


    this.markerLayer.addTo(this.map);

    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  private addMarkersToMap(): void {
    if (!this.map || this.schools.length === 0) return;


    this.markerLayer.clearLayers();

    const btnText = this.language === 'zh' ? '查看詳情' : 'View Details';

    this.schools.slice(0, 300).forEach(school => {
      if (school.latitude && school.longitude) {
        const name = this.language === 'zh' ? school.nameZh : school.nameEn;
        const address = this.language === 'zh' ? school.addressZh : school.addressEn;

        const marker = L.marker([school.latitude, school.longitude]);
        
        marker.bindPopup(`
          <div style="width: 160px; font-family: sans-serif;">
            <b style="color: var(--ion-color-primary); font-size: 14px;">${name}</b><br>
            <p style="font-size: 11px; margin: 5px 0;">${address}</p>
            <button id="btn-${school.id}" style="
              background: var(--ion-color-primary); 
              color: white; 
              border: none; 
              padding: 5px 10px; 
              border-radius: 5px; 
              width: 100%;
              cursor: pointer;">${btnText}</button>
          </div>
        `);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-${school.id}`);
          btn?.addEventListener('click', () => {
            this.router.navigate(['/school-detail', school.id]);
          });
        });


        this.markerLayer.addLayer(marker);
      }
    });
  }
}