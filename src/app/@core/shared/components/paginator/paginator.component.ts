import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginator: any;
  @Input() route: string = "";
  paginas: number[] = [];
  from!: number;
  to!: number;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initPaginator();
  }

  // Procesa la paginacion del componente
  ngOnChanges(changes: SimpleChanges): void {
    let paginatorActualizado = changes['paginator'];
    if (paginatorActualizado.previousValue) {
      this.initPaginator();
    }
  }

  // Cambia para la pagina X
  goPage(page: number): void {
    this.router.navigate([`${this.route}/page/${page - 1}`]);
  }

  // Cambia para la primer pagina
  firstPage(): void {
    this.router.navigate([`${this.route}/page/0`]);
  }

  // Cambia para la ultima pagina
  lastPage(): void {
    this.router.navigate([`${this.route}/page/${this.paginator.totalPages - 1}`]);
  }

  // Cambia para la proxima pagina
  nextPage(): void {
    this.router.navigate([`${this.route}/page/${this.paginator.number + 1}`]);
  }

  // Cambia para la pagina anterior
  backPage(): void {
    this.router.navigate([`${this.route}/page/${this.paginator.number - 1}`]);
  }

  // Carga el paginator, y si son mas que 5 paginas, oculta parcialmente para no ultrapassar 10 paginas
  private initPaginator(): void {
    this.from = Math.min(Math.max(1, this.paginator.number - 4), this.paginator.totalPages - 5);
    this.to = Math.max(Math.min(this.paginator.totalPages, this.paginator.number + 4), 6);

    if (this.paginator.totalPages > 5) {
      this.paginas = new Array(this.to - this.from + 1)
        .fill(0)
        .map((_value, i) => i + this.from);

    } else {
      this.paginas = new Array(this.paginator.totalPages)
        .fill(0)
        .map((_value, i) => i + 1);
    }
  }

}
