import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginator: any;
  paginas: number[] = [];
  from!: number;
  to!: number;

  constructor() { }

  ngOnInit(): void {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let paginatorActualizado = changes['paginator'];
    if (paginatorActualizado.previousValue) {
      this.initPaginator();
    }
  }

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
