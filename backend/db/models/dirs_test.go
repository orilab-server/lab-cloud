// Code generated by SQLBoiler 3.7.1 (https://github.com/volatiletech/sqlboiler). DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package models

import (
	"bytes"
	"context"
	"reflect"
	"testing"

	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries"
	"github.com/volatiletech/sqlboiler/randomize"
	"github.com/volatiletech/sqlboiler/strmangle"
)

var (
	// Relationships sometimes use the reflection helper queries.Equal/queries.Assign
	// so force a package dependency in case they don't.
	_ = queries.Equal
)

func testDirs(t *testing.T) {
	t.Parallel()

	query := Dirs()

	if query.Query == nil {
		t.Error("expected a query, got nothing")
	}
}

func testDirsDelete(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := o.Delete(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := Dirs().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testDirsQueryDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := Dirs().DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := Dirs().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testDirsSliceDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := DirSlice{o}

	if rowsAff, err := slice.DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := Dirs().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testDirsExists(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	e, err := DirExists(ctx, tx, o.ID)
	if err != nil {
		t.Errorf("Unable to check if Dir exists: %s", err)
	}
	if !e {
		t.Errorf("Expected DirExists to return true, but got false.")
	}
}

func testDirsFind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	dirFound, err := FindDir(ctx, tx, o.ID)
	if err != nil {
		t.Error(err)
	}

	if dirFound == nil {
		t.Error("want a record, got nil")
	}
}

func testDirsBind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = Dirs().Bind(ctx, tx, o); err != nil {
		t.Error(err)
	}
}

func testDirsOne(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if x, err := Dirs().One(ctx, tx); err != nil {
		t.Error(err)
	} else if x == nil {
		t.Error("expected to get a non nil record")
	}
}

func testDirsAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	dirOne := &Dir{}
	dirTwo := &Dir{}
	if err = randomize.Struct(seed, dirOne, dirDBTypes, false, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}
	if err = randomize.Struct(seed, dirTwo, dirDBTypes, false, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = dirOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = dirTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := Dirs().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 2 {
		t.Error("want 2 records, got:", len(slice))
	}
}

func testDirsCount(t *testing.T) {
	t.Parallel()

	var err error
	seed := randomize.NewSeed()
	dirOne := &Dir{}
	dirTwo := &Dir{}
	if err = randomize.Struct(seed, dirOne, dirDBTypes, false, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}
	if err = randomize.Struct(seed, dirTwo, dirDBTypes, false, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = dirOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = dirTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Dirs().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 2 {
		t.Error("want 2 records, got:", count)
	}
}

func dirBeforeInsertHook(ctx context.Context, e boil.ContextExecutor, o *Dir) error {
	*o = Dir{}
	return nil
}

func dirAfterInsertHook(ctx context.Context, e boil.ContextExecutor, o *Dir) error {
	*o = Dir{}
	return nil
}

func dirAfterSelectHook(ctx context.Context, e boil.ContextExecutor, o *Dir) error {
	*o = Dir{}
	return nil
}

func dirBeforeUpdateHook(ctx context.Context, e boil.ContextExecutor, o *Dir) error {
	*o = Dir{}
	return nil
}

func dirAfterUpdateHook(ctx context.Context, e boil.ContextExecutor, o *Dir) error {
	*o = Dir{}
	return nil
}

func dirBeforeDeleteHook(ctx context.Context, e boil.ContextExecutor, o *Dir) error {
	*o = Dir{}
	return nil
}

func dirAfterDeleteHook(ctx context.Context, e boil.ContextExecutor, o *Dir) error {
	*o = Dir{}
	return nil
}

func dirBeforeUpsertHook(ctx context.Context, e boil.ContextExecutor, o *Dir) error {
	*o = Dir{}
	return nil
}

func dirAfterUpsertHook(ctx context.Context, e boil.ContextExecutor, o *Dir) error {
	*o = Dir{}
	return nil
}

func testDirsHooks(t *testing.T) {
	t.Parallel()

	var err error

	ctx := context.Background()
	empty := &Dir{}
	o := &Dir{}

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, o, dirDBTypes, false); err != nil {
		t.Errorf("Unable to randomize Dir object: %s", err)
	}

	AddDirHook(boil.BeforeInsertHook, dirBeforeInsertHook)
	if err = o.doBeforeInsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeInsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeInsertHook function to empty object, but got: %#v", o)
	}
	dirBeforeInsertHooks = []DirHook{}

	AddDirHook(boil.AfterInsertHook, dirAfterInsertHook)
	if err = o.doAfterInsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterInsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterInsertHook function to empty object, but got: %#v", o)
	}
	dirAfterInsertHooks = []DirHook{}

	AddDirHook(boil.AfterSelectHook, dirAfterSelectHook)
	if err = o.doAfterSelectHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterSelectHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterSelectHook function to empty object, but got: %#v", o)
	}
	dirAfterSelectHooks = []DirHook{}

	AddDirHook(boil.BeforeUpdateHook, dirBeforeUpdateHook)
	if err = o.doBeforeUpdateHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeUpdateHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeUpdateHook function to empty object, but got: %#v", o)
	}
	dirBeforeUpdateHooks = []DirHook{}

	AddDirHook(boil.AfterUpdateHook, dirAfterUpdateHook)
	if err = o.doAfterUpdateHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterUpdateHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterUpdateHook function to empty object, but got: %#v", o)
	}
	dirAfterUpdateHooks = []DirHook{}

	AddDirHook(boil.BeforeDeleteHook, dirBeforeDeleteHook)
	if err = o.doBeforeDeleteHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeDeleteHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeDeleteHook function to empty object, but got: %#v", o)
	}
	dirBeforeDeleteHooks = []DirHook{}

	AddDirHook(boil.AfterDeleteHook, dirAfterDeleteHook)
	if err = o.doAfterDeleteHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterDeleteHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterDeleteHook function to empty object, but got: %#v", o)
	}
	dirAfterDeleteHooks = []DirHook{}

	AddDirHook(boil.BeforeUpsertHook, dirBeforeUpsertHook)
	if err = o.doBeforeUpsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeUpsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeUpsertHook function to empty object, but got: %#v", o)
	}
	dirBeforeUpsertHooks = []DirHook{}

	AddDirHook(boil.AfterUpsertHook, dirAfterUpsertHook)
	if err = o.doAfterUpsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterUpsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterUpsertHook function to empty object, but got: %#v", o)
	}
	dirAfterUpsertHooks = []DirHook{}
}

func testDirsInsert(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Dirs().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testDirsInsertWhitelist(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Whitelist(dirColumnsWithoutDefault...)); err != nil {
		t.Error(err)
	}

	count, err := Dirs().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testDirToManyFiles(t *testing.T) {
	var err error
	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Dir
	var b, c File

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	if err := a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	if err = randomize.Struct(seed, &b, fileDBTypes, false, fileColumnsWithDefault...); err != nil {
		t.Fatal(err)
	}
	if err = randomize.Struct(seed, &c, fileDBTypes, false, fileColumnsWithDefault...); err != nil {
		t.Fatal(err)
	}

	b.DirID = a.ID
	c.DirID = a.ID

	if err = b.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = c.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	check, err := a.Files().All(ctx, tx)
	if err != nil {
		t.Fatal(err)
	}

	bFound, cFound := false, false
	for _, v := range check {
		if v.DirID == b.DirID {
			bFound = true
		}
		if v.DirID == c.DirID {
			cFound = true
		}
	}

	if !bFound {
		t.Error("expected to find b")
	}
	if !cFound {
		t.Error("expected to find c")
	}

	slice := DirSlice{&a}
	if err = a.L.LoadFiles(ctx, tx, false, (*[]*Dir)(&slice), nil); err != nil {
		t.Fatal(err)
	}
	if got := len(a.R.Files); got != 2 {
		t.Error("number of eager loaded records wrong, got:", got)
	}

	a.R.Files = nil
	if err = a.L.LoadFiles(ctx, tx, true, &a, nil); err != nil {
		t.Fatal(err)
	}
	if got := len(a.R.Files); got != 2 {
		t.Error("number of eager loaded records wrong, got:", got)
	}

	if t.Failed() {
		t.Logf("%#v", check)
	}
}

func testDirToManyTrashes(t *testing.T) {
	var err error
	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Dir
	var b, c Trash

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	if err := a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	if err = randomize.Struct(seed, &b, trashDBTypes, false, trashColumnsWithDefault...); err != nil {
		t.Fatal(err)
	}
	if err = randomize.Struct(seed, &c, trashDBTypes, false, trashColumnsWithDefault...); err != nil {
		t.Fatal(err)
	}

	queries.Assign(&b.DirID, a.ID)
	queries.Assign(&c.DirID, a.ID)
	if err = b.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = c.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	check, err := a.Trashes().All(ctx, tx)
	if err != nil {
		t.Fatal(err)
	}

	bFound, cFound := false, false
	for _, v := range check {
		if queries.Equal(v.DirID, b.DirID) {
			bFound = true
		}
		if queries.Equal(v.DirID, c.DirID) {
			cFound = true
		}
	}

	if !bFound {
		t.Error("expected to find b")
	}
	if !cFound {
		t.Error("expected to find c")
	}

	slice := DirSlice{&a}
	if err = a.L.LoadTrashes(ctx, tx, false, (*[]*Dir)(&slice), nil); err != nil {
		t.Fatal(err)
	}
	if got := len(a.R.Trashes); got != 2 {
		t.Error("number of eager loaded records wrong, got:", got)
	}

	a.R.Trashes = nil
	if err = a.L.LoadTrashes(ctx, tx, true, &a, nil); err != nil {
		t.Fatal(err)
	}
	if got := len(a.R.Trashes); got != 2 {
		t.Error("number of eager loaded records wrong, got:", got)
	}

	if t.Failed() {
		t.Logf("%#v", check)
	}
}

func testDirToManyAddOpFiles(t *testing.T) {
	var err error

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Dir
	var b, c, d, e File

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, dirDBTypes, false, strmangle.SetComplement(dirPrimaryKeyColumns, dirColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	foreigners := []*File{&b, &c, &d, &e}
	for _, x := range foreigners {
		if err = randomize.Struct(seed, x, fileDBTypes, false, strmangle.SetComplement(filePrimaryKeyColumns, fileColumnsWithoutDefault)...); err != nil {
			t.Fatal(err)
		}
	}

	if err := a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = b.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = c.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	foreignersSplitByInsertion := [][]*File{
		{&b, &c},
		{&d, &e},
	}

	for i, x := range foreignersSplitByInsertion {
		err = a.AddFiles(ctx, tx, i != 0, x...)
		if err != nil {
			t.Fatal(err)
		}

		first := x[0]
		second := x[1]

		if a.ID != first.DirID {
			t.Error("foreign key was wrong value", a.ID, first.DirID)
		}
		if a.ID != second.DirID {
			t.Error("foreign key was wrong value", a.ID, second.DirID)
		}

		if first.R.Dir != &a {
			t.Error("relationship was not added properly to the foreign slice")
		}
		if second.R.Dir != &a {
			t.Error("relationship was not added properly to the foreign slice")
		}

		if a.R.Files[i*2] != first {
			t.Error("relationship struct slice not set to correct value")
		}
		if a.R.Files[i*2+1] != second {
			t.Error("relationship struct slice not set to correct value")
		}

		count, err := a.Files().Count(ctx, tx)
		if err != nil {
			t.Fatal(err)
		}
		if want := int64((i + 1) * 2); count != want {
			t.Error("want", want, "got", count)
		}
	}
}
func testDirToManyAddOpTrashes(t *testing.T) {
	var err error

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Dir
	var b, c, d, e Trash

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, dirDBTypes, false, strmangle.SetComplement(dirPrimaryKeyColumns, dirColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	foreigners := []*Trash{&b, &c, &d, &e}
	for _, x := range foreigners {
		if err = randomize.Struct(seed, x, trashDBTypes, false, strmangle.SetComplement(trashPrimaryKeyColumns, trashColumnsWithoutDefault)...); err != nil {
			t.Fatal(err)
		}
	}

	if err := a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = b.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = c.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	foreignersSplitByInsertion := [][]*Trash{
		{&b, &c},
		{&d, &e},
	}

	for i, x := range foreignersSplitByInsertion {
		err = a.AddTrashes(ctx, tx, i != 0, x...)
		if err != nil {
			t.Fatal(err)
		}

		first := x[0]
		second := x[1]

		if !queries.Equal(a.ID, first.DirID) {
			t.Error("foreign key was wrong value", a.ID, first.DirID)
		}
		if !queries.Equal(a.ID, second.DirID) {
			t.Error("foreign key was wrong value", a.ID, second.DirID)
		}

		if first.R.Dir != &a {
			t.Error("relationship was not added properly to the foreign slice")
		}
		if second.R.Dir != &a {
			t.Error("relationship was not added properly to the foreign slice")
		}

		if a.R.Trashes[i*2] != first {
			t.Error("relationship struct slice not set to correct value")
		}
		if a.R.Trashes[i*2+1] != second {
			t.Error("relationship struct slice not set to correct value")
		}

		count, err := a.Trashes().Count(ctx, tx)
		if err != nil {
			t.Fatal(err)
		}
		if want := int64((i + 1) * 2); count != want {
			t.Error("want", want, "got", count)
		}
	}
}

func testDirToManySetOpTrashes(t *testing.T) {
	var err error

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Dir
	var b, c, d, e Trash

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, dirDBTypes, false, strmangle.SetComplement(dirPrimaryKeyColumns, dirColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	foreigners := []*Trash{&b, &c, &d, &e}
	for _, x := range foreigners {
		if err = randomize.Struct(seed, x, trashDBTypes, false, strmangle.SetComplement(trashPrimaryKeyColumns, trashColumnsWithoutDefault)...); err != nil {
			t.Fatal(err)
		}
	}

	if err = a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = b.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = c.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	err = a.SetTrashes(ctx, tx, false, &b, &c)
	if err != nil {
		t.Fatal(err)
	}

	count, err := a.Trashes().Count(ctx, tx)
	if err != nil {
		t.Fatal(err)
	}
	if count != 2 {
		t.Error("count was wrong:", count)
	}

	err = a.SetTrashes(ctx, tx, true, &d, &e)
	if err != nil {
		t.Fatal(err)
	}

	count, err = a.Trashes().Count(ctx, tx)
	if err != nil {
		t.Fatal(err)
	}
	if count != 2 {
		t.Error("count was wrong:", count)
	}

	if !queries.IsValuerNil(b.DirID) {
		t.Error("want b's foreign key value to be nil")
	}
	if !queries.IsValuerNil(c.DirID) {
		t.Error("want c's foreign key value to be nil")
	}
	if !queries.Equal(a.ID, d.DirID) {
		t.Error("foreign key was wrong value", a.ID, d.DirID)
	}
	if !queries.Equal(a.ID, e.DirID) {
		t.Error("foreign key was wrong value", a.ID, e.DirID)
	}

	if b.R.Dir != nil {
		t.Error("relationship was not removed properly from the foreign struct")
	}
	if c.R.Dir != nil {
		t.Error("relationship was not removed properly from the foreign struct")
	}
	if d.R.Dir != &a {
		t.Error("relationship was not added properly to the foreign struct")
	}
	if e.R.Dir != &a {
		t.Error("relationship was not added properly to the foreign struct")
	}

	if a.R.Trashes[0] != &d {
		t.Error("relationship struct slice not set to correct value")
	}
	if a.R.Trashes[1] != &e {
		t.Error("relationship struct slice not set to correct value")
	}
}

func testDirToManyRemoveOpTrashes(t *testing.T) {
	var err error

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Dir
	var b, c, d, e Trash

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, dirDBTypes, false, strmangle.SetComplement(dirPrimaryKeyColumns, dirColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	foreigners := []*Trash{&b, &c, &d, &e}
	for _, x := range foreigners {
		if err = randomize.Struct(seed, x, trashDBTypes, false, strmangle.SetComplement(trashPrimaryKeyColumns, trashColumnsWithoutDefault)...); err != nil {
			t.Fatal(err)
		}
	}

	if err := a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	err = a.AddTrashes(ctx, tx, true, foreigners...)
	if err != nil {
		t.Fatal(err)
	}

	count, err := a.Trashes().Count(ctx, tx)
	if err != nil {
		t.Fatal(err)
	}
	if count != 4 {
		t.Error("count was wrong:", count)
	}

	err = a.RemoveTrashes(ctx, tx, foreigners[:2]...)
	if err != nil {
		t.Fatal(err)
	}

	count, err = a.Trashes().Count(ctx, tx)
	if err != nil {
		t.Fatal(err)
	}
	if count != 2 {
		t.Error("count was wrong:", count)
	}

	if !queries.IsValuerNil(b.DirID) {
		t.Error("want b's foreign key value to be nil")
	}
	if !queries.IsValuerNil(c.DirID) {
		t.Error("want c's foreign key value to be nil")
	}

	if b.R.Dir != nil {
		t.Error("relationship was not removed properly from the foreign struct")
	}
	if c.R.Dir != nil {
		t.Error("relationship was not removed properly from the foreign struct")
	}
	if d.R.Dir != &a {
		t.Error("relationship to a should have been preserved")
	}
	if e.R.Dir != &a {
		t.Error("relationship to a should have been preserved")
	}

	if len(a.R.Trashes) != 2 {
		t.Error("should have preserved two relationships")
	}

	// Removal doesn't do a stable deletion for performance so we have to flip the order
	if a.R.Trashes[1] != &d {
		t.Error("relationship to d should have been preserved")
	}
	if a.R.Trashes[0] != &e {
		t.Error("relationship to e should have been preserved")
	}
}

func testDirToOneUserUsingUser(t *testing.T) {
	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var local Dir
	var foreign User

	seed := randomize.NewSeed()
	if err := randomize.Struct(seed, &local, dirDBTypes, false, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}
	if err := randomize.Struct(seed, &foreign, userDBTypes, false, userColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize User struct: %s", err)
	}

	if err := foreign.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	local.UserID = foreign.ID
	if err := local.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	check, err := local.User().One(ctx, tx)
	if err != nil {
		t.Fatal(err)
	}

	if check.ID != foreign.ID {
		t.Errorf("want: %v, got %v", foreign.ID, check.ID)
	}

	slice := DirSlice{&local}
	if err = local.L.LoadUser(ctx, tx, false, (*[]*Dir)(&slice), nil); err != nil {
		t.Fatal(err)
	}
	if local.R.User == nil {
		t.Error("struct should have been eager loaded")
	}

	local.R.User = nil
	if err = local.L.LoadUser(ctx, tx, true, &local, nil); err != nil {
		t.Fatal(err)
	}
	if local.R.User == nil {
		t.Error("struct should have been eager loaded")
	}
}

func testDirToOneSetOpUserUsingUser(t *testing.T) {
	var err error

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()

	var a Dir
	var b, c User

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, &a, dirDBTypes, false, strmangle.SetComplement(dirPrimaryKeyColumns, dirColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	if err = randomize.Struct(seed, &b, userDBTypes, false, strmangle.SetComplement(userPrimaryKeyColumns, userColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}
	if err = randomize.Struct(seed, &c, userDBTypes, false, strmangle.SetComplement(userPrimaryKeyColumns, userColumnsWithoutDefault)...); err != nil {
		t.Fatal(err)
	}

	if err := a.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}
	if err = b.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Fatal(err)
	}

	for i, x := range []*User{&b, &c} {
		err = a.SetUser(ctx, tx, i != 0, x)
		if err != nil {
			t.Fatal(err)
		}

		if a.R.User != x {
			t.Error("relationship struct not set to correct value")
		}

		if x.R.Dirs[0] != &a {
			t.Error("failed to append to foreign relationship struct")
		}
		if a.UserID != x.ID {
			t.Error("foreign key was wrong value", a.UserID)
		}

		zero := reflect.Zero(reflect.TypeOf(a.UserID))
		reflect.Indirect(reflect.ValueOf(&a.UserID)).Set(zero)

		if err = a.Reload(ctx, tx); err != nil {
			t.Fatal("failed to reload", err)
		}

		if a.UserID != x.ID {
			t.Error("foreign key was wrong value", a.UserID, x.ID)
		}
	}
}

func testDirsReload(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = o.Reload(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testDirsReloadAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := DirSlice{o}

	if err = slice.ReloadAll(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testDirsSelect(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := Dirs().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 1 {
		t.Error("want one record, got:", len(slice))
	}
}

var (
	dirDBTypes = map[string]string{`ID`: `uuid`, `ParentID`: `uuid`, `UserID`: `uuid`, `Location`: `text`, `Name`: `text`, `CreatedAt`: `timestamp without time zone`, `UpdatedAt`: `timestamp without time zone`}
	_          = bytes.MinRead
)

func testDirsUpdate(t *testing.T) {
	t.Parallel()

	if 0 == len(dirPrimaryKeyColumns) {
		t.Skip("Skipping table with no primary key columns")
	}
	if len(dirAllColumns) == len(dirPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Dirs().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, dirDBTypes, true, dirPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	if rowsAff, err := o.Update(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only affect one row but affected", rowsAff)
	}
}

func testDirsSliceUpdateAll(t *testing.T) {
	t.Parallel()

	if len(dirAllColumns) == len(dirPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &Dir{}
	if err = randomize.Struct(seed, o, dirDBTypes, true, dirColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Dirs().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, dirDBTypes, true, dirPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	// Remove Primary keys and unique columns from what we plan to update
	var fields []string
	if strmangle.StringSliceMatch(dirAllColumns, dirPrimaryKeyColumns) {
		fields = dirAllColumns
	} else {
		fields = strmangle.SetComplement(
			dirAllColumns,
			dirPrimaryKeyColumns,
		)
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	typ := reflect.TypeOf(o).Elem()
	n := typ.NumField()

	updateMap := M{}
	for _, col := range fields {
		for i := 0; i < n; i++ {
			f := typ.Field(i)
			if f.Tag.Get("boil") == col {
				updateMap[col] = value.Field(i).Interface()
			}
		}
	}

	slice := DirSlice{o}
	if rowsAff, err := slice.UpdateAll(ctx, tx, updateMap); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("wanted one record updated but got", rowsAff)
	}
}

func testDirsUpsert(t *testing.T) {
	t.Parallel()

	if len(dirAllColumns) == len(dirPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	// Attempt the INSERT side of an UPSERT
	o := Dir{}
	if err = randomize.Struct(seed, &o, dirDBTypes, true); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Upsert(ctx, tx, false, nil, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert Dir: %s", err)
	}

	count, err := Dirs().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}

	// Attempt the UPDATE side of an UPSERT
	if err = randomize.Struct(seed, &o, dirDBTypes, false, dirPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize Dir struct: %s", err)
	}

	if err = o.Upsert(ctx, tx, true, nil, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert Dir: %s", err)
	}

	count, err = Dirs().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}
}
