import Header from '../components/Header';
import AnimalMap from '../components/AnimalMap'; // renamed from AnimalWiki
import AnimalDetailsPanel from '../components/AnimalDetailsPanel'; // new component


function AnimalWikiPage() {
  return (
    <>
      <Header />
      <div className="container-fluid my-4">
        <div className="row">
          <div className="col-md-2 mb-3">
            <AnimalDetailsPanel />
          </div>
          <div className="col-md-10">
            <AnimalMap />
          </div>
        </div>
      </div>
    </>
  );
}

export default AnimalWikiPage;
