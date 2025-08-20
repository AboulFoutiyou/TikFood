import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.service';
import { VendorProduct } from '../models/vendor.model';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonItem,
  IonLabel,
  IonToggle,
  IonChip,
  IonImg,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBack,
  addOutline,
  exitOutline,
  trashOutline,
  imageOutline,
  saveOutline,
  closeOutline
} from 'ionicons/icons';


@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonItem,
    IonLabel,
    IonToggle,
    IonChip,
    IonImg,
    IonModal,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    //IonGrid,
    //IonRow,
    //IonCol
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vendor-products.component.html',
  styleUrls: ['./vendor-products.component.scss']
})
export class VendorProductsComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef!: ElementRef<HTMLInputElement>;

  products: VendorProduct[] = [];
  isModalOpen = false;
  editingProduct: VendorProduct | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isImage: boolean = true;
  
  newProduct = {
    name: '',
    description: '',
    price: 0,
    category: 'salé' as 'sucré' | 'salé' | 'mixte' | 'jus',
    images: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'],
    isAvailable: true
  };

  categories = [
    { value: 'sucré', label: 'Sucré' },
    { value: 'salé', label: 'Salé' },
    { value: 'mixte', label: 'Mixte' },
    { value: 'jus', label: 'Jus' }
  ];

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {
    addIcons({
      'chevron-back': chevronBack,
      'add-outline': addOutline,
      'exit-outline': exitOutline,
      'trash-outline': trashOutline,
      'image-outline': imageOutline,
      'save-outline': saveOutline,
      'close-outline': closeOutline,
      'edit-outline': closeOutline
    });
  }

  ngOnInit(): void {
    this.vendorService.products$.subscribe(products => {
      this.products = products;
      console.log('Produits récupérés :', this.products);
    });
  }

  selectFile(): void {
    // On clique par programmation sur l'input caché
    this.filePickerRef.nativeElement.click();
  }

  /**
   * Se déclenche quand l'utilisateur a choisi un fichier.
   * @param event L'événement du champ input.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // On stocke le fichier pour l'envoyer plus tard au backend
      this.selectedFile = file;

      // On détermine si c'est une image ou une vidéo
      this.isImage = file.type.startsWith('image/');
      
      // On génère une URL locale pour l'aperçu
      // Cette URL ne fonctionne que dans le navigateur de l'utilisateur
      this.previewUrl = URL.createObjectURL(file);

      // Met à jour directement newProduct.images avec l'image uploadée
      this.newProduct.images = [this.previewUrl];
    }
  }

  goBack(): void {
    this.router.navigate(['/vendor-dashboard']);
  }

  openAddModal(): void {
    this.editingProduct = null;
    this.resetForm();
    this.isModalOpen = true;
  }

  openEditModal(product: VendorProduct): void {
    this.editingProduct = product;
    this.previewUrl = product.images && product.images.length > 0 ? product.images[0] : null;
    this.newProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: [...product.images],
      isAvailable: product.isAvailable
    };
    this.isModalOpen = true;
    
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingProduct = null;
    this.resetForm();
  }

  saveProduct(): void {
    // if (this.editingProduct) {
    //   this.vendorService.updateProduct(this.editingProduct.id, this.newProduct);
    // } else {
    //   this.vendorService.addProduct(this.newProduct);
    // }
    const formData = new FormData();
  formData.append('name', this.newProduct.name);
  formData.append('description', this.newProduct.description);
  formData.append('price', this.newProduct.price.toString());
  formData.append('category', this.newProduct.category);
  formData.append('isAvailable', this.newProduct.isAvailable.toString());

  if (this.selectedFile) {
    formData.append('images', this.selectedFile, this.selectedFile.name);
  } else {
    console.error("L'image est obligatoire pour créer un produit.");
    return;
  }
  
  // 2. Appeler une NOUVELLE méthode dans VendorService
  this.vendorService.addProductWithFile(formData).subscribe({
    next: () => {
      // Le VendorService mettra à jour la liste des produits lui-même
      this.closeModal();
    },
    error: (err) => {
      console.error("Erreur lors de l'ajout du produit depuis le component :", err);
    }
  });
  }

  deleteProduct(product: VendorProduct): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      this.vendorService.deleteProduct(product.id);
    }
  }

  toggleProductAvailability(product: VendorProduct): void {
    this.vendorService.toggleProductAvailability(product.id);
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      category: 'salé',
      images: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'],
      isAvailable: true
    };
  }

  formatPrice(price: number): string {
    return price.toLocaleString() + ' F CFA';
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'sucré': 'secondary',
      'salé': 'primary',
      'mixte': 'tertiary',
      'jus': 'success'
    };
    return colors[category] || 'medium';
  }

  getAvailabilityColor(isAvailable: boolean): string {
    return isAvailable ? 'success' : 'danger';
  }

  getAvailabilityText(isAvailable: boolean): string {
    return isAvailable ? 'Disponible' : 'Indisponible';
  }

  isFormValid(): boolean {
    return this.newProduct.name.trim() !== '' && 
           this.newProduct.description.trim() !== '' && 
           this.newProduct.price > 0;
  }
}